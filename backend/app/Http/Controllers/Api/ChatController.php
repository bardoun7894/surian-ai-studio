<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatConversation;
use App\Models\Directorate;
use App\Models\Faq;
use App\Models\SystemSetting;
use App\Services\VectorSearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    protected VectorSearchService $vectorSearch;

    public function __construct(VectorSearchService $vectorSearch)
    {
        $this->vectorSearch = $vectorSearch;
    }
    /**
     * Send a message to the AI chatbot and store the conversation
     * 
     * POST /api/v1/chat/message
     */
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
            'session_id' => 'nullable|string',
            'language' => 'nullable|string|in:ar,en',
        ]);

        $sessionId = $validated['session_id'] ?? Str::uuid()->toString();
        $language = $validated['language'] ?? 'ar';

        // Find or create conversation
        $conversation = ChatConversation::findBySession($sessionId);
        
        if (!$conversation) {
            $conversation = ChatConversation::create([
                'session_id' => $sessionId,
                'user_id' => auth()->id(),
                'messages' => [],
                'metadata' => [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'language' => $language,
                ],
            ]);
        }

        // Add user message
        $conversation->addMessage('user', $validated['message']);

        // Forward to AI service with RAG context
        try {
            $aiServiceUrl = config('external.ai_service.url');

            $ragResult = $this->buildRagContext($validated['message'], $language);
            $ragContext = $ragResult['context'];
            $useGoogleSearch = $ragResult['use_google_search'];

            $response = Http::timeout(30)->post("{$aiServiceUrl}/api/v1/ai/chat?provider=gemini", [
                'prompt' => $validated['message'],
                'system_prompt' => $ragContext,
                'use_google_search' => $useGoogleSearch,
            ]);

            if ($response->successful()) {
                $aiResponse = $response->json()['response'] ?? 'عذراً، لم أتمكن من فهم سؤالك.';
                
                // Add AI response
                $conversation->addMessage('assistant', $aiResponse);

                return response()->json([
                    'session_id' => $sessionId,
                    'response' => $aiResponse,
                    'timestamp' => now()->toIso8601String(),
                ]);
            }

            throw new \Exception('AI service error: ' . $response->body());
        } catch (\Exception $e) {
            \Log::error('Chat AI service error', ['error' => $e->getMessage()]);
            
            return response()->json([
                'session_id' => $sessionId,
                'response' => 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
                'error' => true,
            ], 500);
        }
    }

    /**
     * Get conversation history
     * 
     * GET /api/v1/chat/history/{sessionId}
     */
    public function getHistory(string $sessionId)
    {
        $conversation = ChatConversation::findBySession($sessionId);

        if (!$conversation) {
            return response()->json([
                'messages' => [],
                'session_id' => $sessionId,
            ]);
        }

        // Verify ownership for authenticated users
        if (auth()->check() && $conversation->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json([
            'session_id' => $sessionId,
            'messages' => $conversation->messages,
            'created_at' => $conversation->created_at,
        ]);
    }

    /**
     * Clear conversation session
     * 
     * DELETE /api/v1/chat/session/{sessionId}
     */
    public function clearSession(string $sessionId)
    {
        $conversation = ChatConversation::findBySession($sessionId);

        if (!$conversation) {
            return response()->json(['message' => 'Session not found'], 404);
        }

        // Verify ownership for authenticated users
        if (auth()->check() && $conversation->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $conversation->delete();

        return response()->json(['message' => 'Session cleared successfully']);
    }

    /**
     * FR-35: Request human handoff
     *
     * POST /api/v1/chat/handoff
     */
    public function requestHandoff(Request $request)
    {
        $validated = $request->validate([
            'session_id' => 'required|string',
            'reason' => 'nullable|string|max:500',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string|max:20',
        ]);

        $conversation = ChatConversation::findBySession($validated['session_id']);

        if (!$conversation) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        // Mark conversation as requiring handoff
        $conversation->update([
            'handoff_requested' => true,
            'handoff_requested_at' => now(),
            'handoff_reason' => $validated['reason'] ?? null,
            'handoff_status' => 'pending',
            'metadata' => array_merge($conversation->metadata ?? [], [
                'contact_email' => $validated['contact_email'] ?? null,
                'contact_phone' => $validated['contact_phone'] ?? null,
            ]),
        ]);

        // Add system message to conversation
        $conversation->addMessage('system', 'تم طلب التحويل لموظف مختص. سيتم التواصل معك قريباً.');

        // Notify staff about handoff request
        $this->notifyStaffAboutHandoff($conversation);

        return response()->json([
            'message' => 'تم طلب التحويل بنجاح',
            'handoff_id' => $conversation->id,
            'status' => 'pending',
        ]);
    }

    /**
     * FR-35: Get pending handoff requests (for staff)
     *
     * GET /api/v1/chat/handoffs
     */
    public function listHandoffs(Request $request)
    {
        $status = $request->get('status', 'pending');

        $handoffs = ChatConversation::where('handoff_requested', true)
            ->when($status !== 'all', fn($q) => $q->where('handoff_status', $status))
            ->with('user:id,name,email')
            ->orderBy('handoff_requested_at', 'desc')
            ->paginate(20);

        return response()->json($handoffs);
    }

    /**
     * FR-35: Handle handoff (staff assigns themselves)
     *
     * PUT /api/v1/chat/handoffs/{id}/assign
     */
    public function assignHandoff(Request $request, int $id)
    {
        $conversation = ChatConversation::findOrFail($id);

        if (!$conversation->handoff_requested) {
            return response()->json(['error' => 'No handoff requested'], 400);
        }

        $conversation->update([
            'handoff_status' => 'assigned',
            'handoff_assigned_to' => auth()->id(),
            'handoff_assigned_at' => now(),
        ]);

        // Add system message
        $staffName = auth()->user()->name ?? 'موظف';
        $conversation->addMessage('system', "تم تعيين {$staffName} للرد على استفسارك.");

        return response()->json([
            'message' => 'تم تعيين المحادثة بنجاح',
            'assigned_to' => auth()->user()->name,
        ]);
    }

    /**
     * FR-35: Staff responds to handoff
     *
     * POST /api/v1/chat/handoffs/{id}/respond
     */
    public function respondToHandoff(Request $request, int $id)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $conversation = ChatConversation::findOrFail($id);

        if ($conversation->handoff_assigned_to !== auth()->id()) {
            return response()->json(['error' => 'Not assigned to you'], 403);
        }

        // Add staff response
        $conversation->addMessage('staff', $validated['message'], [
            'staff_id' => auth()->id(),
            'staff_name' => auth()->user()->name,
        ]);

        return response()->json([
            'message' => 'تم إرسال الرد بنجاح',
        ]);
    }

    /**
     * FR-35: Close handoff
     *
     * PUT /api/v1/chat/handoffs/{id}/close
     */
    public function closeHandoff(Request $request, int $id)
    {
        $conversation = ChatConversation::findOrFail($id);

        $conversation->update([
            'handoff_status' => 'closed',
            'handoff_closed_at' => now(),
        ]);

        $conversation->addMessage('system', 'تم إغلاق المحادثة. شكراً لتواصلك معنا.');

        return response()->json([
            'message' => 'تم إغلاق المحادثة',
        ]);
    }

    /**
     * Build RAG-enhanced context for the chatbot.
     * Combines static identity/guides with dynamically retrieved relevant content.
     * Returns array with 'context' string and 'use_google_search' flag.
     */
    private function buildRagContext(string $query, string $language): array
    {
        $isAr = $language === 'ar';
        $parts = [];

        // 1. Static context (cached 1 hour): identity + process guides + contacts
        $parts[] = $this->getStaticContext($language);

        // 2. Semantic search via pgvector (relevant published content)
        $contentContext = $this->retrieveRelevantContent($query, $language);
        if ($contentContext) {
            $parts[] = $contentContext;
        }

        // 3. Keyword-matched FAQs
        $faqContext = $this->retrieveRelevantFaqs($query, $language);
        if ($faqContext) {
            $parts[] = $faqContext;
        }

        // 4. Directorate info if query mentions one by name
        $dirContext = $this->retrieveRelevantDirectorate($query, $language);
        if ($dirContext) {
            $parts[] = $dirContext;
        }

        // 5. Instructions
        if ($isAr) {
            $parts[] = "\n\nأجب فقط بناءً على المعلومات المقدمة أعلاه. إذا لم تجد الإجابة، يمكنك البحث في الإنترنت أو اقترح على المستخدم التواصل مع الوزارة مباشرة.";
        } else {
            $parts[] = "\n\nAnswer based on the information provided above. If you cannot find the answer, you may search the internet or suggest the user contact the ministry directly.";
        }

        $hasRetrievedContent = $contentContext || $faqContext || $dirContext;

        // Fallback: if RAG retrieved nothing beyond static context, use legacy full-dump
        // AND enable Google Search grounding so Gemini can look up external info
        if (!$hasRetrievedContent) {
            return [
                'context' => $this->buildKnowledgeContextLegacy($language),
                'use_google_search' => true,
            ];
        }

        return [
            'context' => implode('', $parts),
            'use_google_search' => false,
        ];
    }

    /**
     * Static context: ministry identity, contact info, website structure, services, and process guides.
     * Cached for 1 hour since this rarely changes.
     */
    private function getStaticContext(string $language): string
    {
        $cacheKey = "chatbot_static_context_v2:{$language}";

        return Cache::remember($cacheKey, 3600, function () use ($language) {
            $isAr = $language === 'ar';
            $parts = [];

            // Identity
            if ($isAr) {
                $parts[] = "أنت المساعد الذكي لوزارة الاقتصاد والصناعة في الجمهورية العربية السورية. ساعد المواطنين والشركات في الوصول إلى المعلومات والخدمات. كن مهذباً ودقيقاً ومختصراً. الاسم الرسمي: وزارة الاقتصاد والصناعة.";
            } else {
                $parts[] = "You are the AI assistant for the Ministry of Economy and Industry of the Syrian Arab Republic. Help citizens and businesses access information and services. Be polite, accurate, and concise. Official name: Ministry of Economy and Industry.";
            }

            // Contact info from settings
            try {
                $contactPhone = SystemSetting::get('contact_phone');
                $contactEmail = SystemSetting::get('contact_email');
                $contactAddress = SystemSetting::get($isAr ? 'contact_address_ar' : 'contact_address_en');
                $workingHours = SystemSetting::get($isAr ? 'contact_working_hours_ar' : 'contact_working_hours_en');
                $hotline = '19999';

                $info = $isAr ? "\n\nمعلومات التواصل:" : "\n\nContact Information:";
                $info .= ($isAr ? "\n- الخط الساخن الموحد: " : "\n- Unified Hotline: ") . $hotline;
                if ($contactPhone) $info .= ($isAr ? "\n- هاتف: " : "\n- Phone: ") . $contactPhone;
                if ($contactEmail) $info .= ($isAr ? "\n- بريد إلكتروني: " : "\n- Email: ") . $contactEmail;
                if ($contactAddress) $info .= ($isAr ? "\n- المقر: " : "\n- HQ: ") . $contactAddress;
                if ($workingHours) $info .= ($isAr ? "\n- ساعات العمل: " : "\n- Working hours: ") . $workingHours;
                $parts[] = $info;
            } catch (\Exception $e) {
                // Fallback
                $parts[] = $isAr
                    ? "\n\nمعلومات التواصل:\n- الخط الساخن: 19999\n- البريد: info@moe.gov.sy\n- المقر: دمشق - الجمارك مقابل الأمن الجنائي\n- ساعات العمل: الأحد - الخميس 8:00 - 15:30"
                    : "\n\nContact: Hotline 19999, Email info@moe.gov.sy, HQ Damascus, Sun-Thu 8:00-15:30";
            }

            // Website structure & navigation guide
            if ($isAr) {
                $parts[] = "\n\nهيكل الموقع والصفحات المتاحة:";
                $parts[] = "\n- الصفحة الرئيسية (/) - أخبار، إعلانات، خدمات، شكاوى، مقترحات، خريطة تفاعلية";
                $parts[] = "\n- الأخبار (/news) - آخر أخبار الوزارة والإدارات";
                $parts[] = "\n- الإعلانات (/announcements) - إعلانات رسمية ومناقصات";
                $parts[] = "\n- الخدمات (/services) - دليل الخدمات الحكومية (إلكترونية وورقية)";
                $parts[] = "\n- الشكاوى (/complaints) - تقديم شكوى ومتابعتها برقم التتبع";
                $parts[] = "\n- المقترحات (/suggestions) - تقديم مقترح ومتابعته";
                $parts[] = "\n- الهيكل التنظيمي (/directorates) - 3 إدارات عامة + مديريات تابعة";
                $parts[] = "\n- المركز الإعلامي (/media) - ألبومات صور وفيديوهات";
                $parts[] = "\n- القوانين والمراسيم (/decrees) - تشريعات وقوانين";
                $parts[] = "\n- الأسئلة الشائعة (/faq) - إجابات على الاستفسارات الشائعة";
                $parts[] = "\n- الاستثمار (/investment) - فرص استثمارية في مختلف القطاعات";
                $parts[] = "\n- تواصل معنا (/contact) - نموذج مراسلة ومعلومات اتصال";
                $parts[] = "\n- تسجيل الدخول (/login) - دخول بالبريد الإلكتروني أو رقم الهاتف";
                $parts[] = "\n- إنشاء حساب (/register) - تسجيل حساب جديد بالرقم الوطني";
                $parts[] = "\n- الملف الشخصي (/profile) - إدارة البيانات الشخصية والمفضلة والشكاوى";
            } else {
                $parts[] = "\n\nWebsite structure:";
                $parts[] = "\n- Home (/) - News, announcements, services, complaints, suggestions, interactive map";
                $parts[] = "\n- News (/news) - Latest ministry and directorate news";
                $parts[] = "\n- Announcements (/announcements) - Official announcements and tenders";
                $parts[] = "\n- Services (/services) - Government services guide (digital & manual)";
                $parts[] = "\n- Complaints (/complaints) - Submit and track complaints";
                $parts[] = "\n- Suggestions (/suggestions) - Submit and track suggestions";
                $parts[] = "\n- Org Structure (/directorates) - 3 general administrations + sub-directorates";
                $parts[] = "\n- Media Center (/media) - Photo albums and videos";
                $parts[] = "\n- Laws & Decrees (/decrees) - Legislation and laws";
                $parts[] = "\n- FAQ (/faq) - Frequently asked questions";
                $parts[] = "\n- Investment (/investment) - Investment opportunities";
                $parts[] = "\n- Contact (/contact) - Contact form and information";
                $parts[] = "\n- Login (/login) - Sign in with email or phone";
                $parts[] = "\n- Register (/register) - Create account with national ID";
                $parts[] = "\n- Profile (/profile) - Manage personal data, favorites, complaints";
            }

            // Directorates overview
            try {
                $directorates = Directorate::where('is_active', true)->get();
                if ($directorates->isNotEmpty()) {
                    $parts[] = $isAr ? "\n\nالإدارات والمديريات:" : "\n\nDirectorates:";
                    foreach ($directorates as $dir) {
                        $name = $isAr ? $dir->name_ar : ($dir->name_en ?: $dir->name_ar);
                        $desc = $isAr ? ($dir->description_ar ?? '') : ($dir->description_en ?? $dir->description_ar ?? '');
                        $desc = Str::limit(strip_tags($desc), 150);
                        $line = "\n- {$name}";
                        if ($dir->phone) $line .= ($isAr ? " | هاتف: " : " | Phone: ") . $dir->phone;
                        if ($dir->email) $line .= ($isAr ? " | بريد: " : " | Email: ") . $dir->email;
                        if ($desc) $line .= " | " . $desc;
                        $parts[] = $line;
                    }
                }
            } catch (\Exception $e) {
                // Skip
            }

            // Services overview
            try {
                $services = \App\Models\Service::where('is_active', true)->limit(30)->get();
                if ($services->isNotEmpty()) {
                    $parts[] = $isAr ? "\n\nالخدمات المتاحة:" : "\n\nAvailable Services:";
                    foreach ($services as $svc) {
                        $title = $isAr ? ($svc->title_ar ?? $svc->title_en) : ($svc->title_en ?? $svc->title_ar);
                        $type = $svc->is_digital ? ($isAr ? 'إلكترونية' : 'Digital') : ($isAr ? 'ورقية' : 'Manual');
                        $parts[] = "\n- {$title} ({$type})";
                    }
                }
            } catch (\Exception $e) {
                // Skip
            }

            // Process guides
            if ($isAr) {
                $parts[] = "\n\nتقديم شكوى: صفحة الشكاوى ← الموافقة على الشروط ← البيانات الشخصية (أو مجهول) ← اختيار الإدارة ← كتابة التفاصيل ← إرفاق مستندات (حتى 5 ملفات) ← حفظ رقم التتبع.";
                $parts[] = "\nتقديم مقترح: صفحة المقترحات ← الموافقة على الشروط ← البيانات الشخصية (أو مجهول) ← اختيار الإدارة ← كتابة التفاصيل ← حفظ رقم التتبع.";
                $parts[] = "\nمتابعة شكوى/مقترح: أدخل رقم التتبع والرقم الوطني في صفحة المتابعة.";
                $parts[] = "\nإنشاء حساب: يتطلب الرقم الوطني (11 رقم) + البريد الإلكتروني + رقم الهاتف + تاريخ الميلاد (العمر 13 سنة فأكثر).";
                $parts[] = "\nتسجيل الدخول: بالبريد الإلكتروني أو رقم الهاتف + كلمة المرور. يدعم التحقق بخطوتين.";
                $parts[] = "\nالمفضلة: يمكن للمستخدم حفظ الأخبار والخدمات في المفضلة من خلال أيقونة القلب.";
            } else {
                $parts[] = "\n\nSubmit complaint: Complaints → Accept terms → Personal info (or anonymous) → Select directorate → Describe → Attach up to 5 files → Save tracking number.";
                $parts[] = "\nSubmit suggestion: Suggestions → Accept terms → Personal info (or anonymous) → Select directorate → Describe → Save tracking number.";
                $parts[] = "\nTrack complaint/suggestion: Enter tracking number and national ID on the tracking page.";
                $parts[] = "\nCreate account: Requires national ID (11 digits) + email + phone + date of birth (age 13+).";
                $parts[] = "\nLogin: Email or phone + password. Supports two-factor authentication.";
                $parts[] = "\nFavorites: Users can save news and services to favorites via the heart icon.";
            }

            return implode('', $parts);
        });
    }

    /**
     * Retrieve relevant content via pgvector semantic search.
     * Returns top 5 results, each truncated to 500 chars.
     */
    private function retrieveRelevantContent(string $query, string $language): ?string
    {
        try {
            $results = $this->vectorSearch->semanticSearch($query, 5);

            if ($results->isEmpty()) {
                return null;
            }

            $isAr = $language === 'ar';
            $section = $isAr ? "\n\nمعلومات ذات صلة:" : "\n\nRelevant Information:";

            foreach ($results as $item) {
                $title = $isAr ? ($item->title_ar ?? $item->title_en) : ($item->title_en ?? $item->title_ar);
                $body = $isAr ? ($item->content_ar ?? $item->content_en) : ($item->content_en ?? $item->content_ar);
                $body = strip_tags($body ?? '');
                $body = Str::limit($body, 500);
                $label = $this->getCategoryLabel($item->category ?? '', $isAr);

                $section .= "\n[{$label}] {$title}: {$body}";
            }

            return $section;
        } catch (\Exception $e) {
            Log::warning('RAG content retrieval failed', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Retrieve relevant FAQs using keyword ILIKE search.
     * Returns top 3 matches, each answer truncated to 300 chars.
     */
    private function retrieveRelevantFaqs(string $query, string $language): ?string
    {
        try {
            // Extract meaningful keywords (3+ chars) from query
            $words = preg_split('/\s+/', $query);
            $keywords = array_filter($words, fn($w) => mb_strlen($w) >= 3);

            if (empty($keywords)) {
                return null;
            }

            $isAr = $language === 'ar';
            $qCol = $isAr ? 'question_ar' : 'question_en';
            $aCol = $isAr ? 'answer_ar' : 'answer_en';

            $faqQuery = Faq::where('is_active', true)->where('is_published', true);

            $faqQuery->where(function ($q) use ($keywords, $qCol, $aCol) {
                foreach ($keywords as $keyword) {
                    $q->orWhere($qCol, 'ILIKE', "%{$keyword}%")
                      ->orWhere($aCol, 'ILIKE', "%{$keyword}%");
                    // Also search Arabic columns when language is English
                    $q->orWhere('question_ar', 'ILIKE', "%{$keyword}%")
                      ->orWhere('answer_ar', 'ILIKE', "%{$keyword}%");
                }
            });

            $faqs = $faqQuery->limit(3)->get();

            if ($faqs->isEmpty()) {
                return null;
            }

            $section = $isAr ? "\n\nأسئلة شائعة ذات صلة:" : "\n\nRelated FAQs:";
            foreach ($faqs as $faq) {
                $question = $isAr ? $faq->question_ar : ($faq->question_en ?: $faq->question_ar);
                $answer = $isAr ? $faq->answer_ar : ($faq->answer_en ?: $faq->answer_ar);
                $answer = Str::limit($answer ?? '', 300);
                if ($question && $answer) {
                    $section .= "\n- {$question}\n  {$answer}";
                }
            }

            return $section;
        } catch (\Exception $e) {
            Log::warning('RAG FAQ retrieval failed', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Retrieve directorate info if the query mentions a directorate name.
     */
    private function retrieveRelevantDirectorate(string $query, string $language): ?string
    {
        try {
            $directorates = Cache::remember('chatbot_directorates_list', 3600, function () {
                return Directorate::where('is_active', true)->get();
            });

            $isAr = $language === 'ar';
            $matched = [];

            foreach ($directorates as $dir) {
                $nameAr = $dir->name_ar ?? '';
                $nameEn = $dir->name_en ?? '';
                if (($nameAr && mb_stripos($query, $nameAr) !== false) ||
                    ($nameEn && mb_stripos($query, $nameEn) !== false)) {
                    $matched[] = $dir;
                }
            }

            if (empty($matched)) {
                // If query is about directorates in general, list them all briefly
                $generalKeywords = ['إدارات', 'إدارة', 'directorates', 'directorate', 'departments'];
                $isGeneralQuery = false;
                foreach ($generalKeywords as $kw) {
                    if (mb_stripos($query, $kw) !== false) {
                        $isGeneralQuery = true;
                        break;
                    }
                }

                if ($isGeneralQuery) {
                    $section = $isAr ? "\n\nإدارات الوزارة:" : "\n\nMinistry Directorates:";
                    foreach ($directorates as $dir) {
                        $name = $isAr ? $dir->name_ar : ($dir->name_en ?: $dir->name_ar);
                        $section .= "\n- {$name}";
                    }
                    return $section;
                }

                return null;
            }

            $section = $isAr ? "\n\nمعلومات الإدارة:" : "\n\nDirectorate Information:";
            foreach ($matched as $dir) {
                $name = $isAr ? $dir->name_ar : ($dir->name_en ?: $dir->name_ar);
                $section .= "\n- {$name}";
                if ($dir->phone) $section .= ($isAr ? " | هاتف: " : " | Phone: ") . $dir->phone;
                if ($dir->email) $section .= ($isAr ? " | بريد: " : " | Email: ") . $dir->email;
                if ($isAr && $dir->address_ar) $section .= " | العنوان: " . $dir->address_ar;
                if (!$isAr && ($dir->address_en ?: $dir->address_ar)) $section .= " | Address: " . ($dir->address_en ?: $dir->address_ar);
            }

            return $section;
        } catch (\Exception $e) {
            Log::warning('RAG directorate retrieval failed', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Map content category to human-readable label.
     */
    private function getCategoryLabel(string $category, bool $isAr): string
    {
        $labels = [
            'news'         => $isAr ? 'خبر' : 'News',
            'announcement' => $isAr ? 'إعلان' : 'Announcement',
            'decree'       => $isAr ? 'مرسوم' : 'Decree',
            'service'      => $isAr ? 'خدمة' : 'Service',
            'faq'          => $isAr ? 'سؤال شائع' : 'FAQ',
            'about'        => $isAr ? 'عن الوزارة' : 'About',
            'media'        => $isAr ? 'وسائط' : 'Media',
            'page'         => $isAr ? 'صفحة' : 'Page',
        ];

        return $labels[$category] ?? ($isAr ? 'محتوى' : 'Content');
    }

    /**
     * Legacy: full-dump knowledge context. Used as fallback when RAG retrieval
     * returns nothing (e.g., pgvector unavailable, no embeddings yet).
     * Enhanced with comprehensive website training data.
     */
    private function buildKnowledgeContextLegacy(string $language): string
    {
        $cacheKey = "chatbot_knowledge_context_legacy_v2:{$language}";

        return Cache::remember($cacheKey, 1800, function () use ($language) {
            // Reuse the enhanced static context as base (already includes identity,
            // contact info, website structure, directorates, services, process guides)
            $parts = [$this->getStaticContext($language)];

            $isAr = $language === 'ar';

            // Add ALL FAQs for comprehensive knowledge
            try {
                $faqs = Faq::where('is_active', true)->where('is_published', true)->limit(30)->get();
                if ($faqs->isNotEmpty()) {
                    $faqSection = $isAr ? "\n\nالأسئلة الشائعة:" : "\n\nFrequently Asked Questions:";
                    foreach ($faqs as $faq) {
                        $q = $isAr ? $faq->question_ar : ($faq->question_en ?: $faq->question_ar);
                        $a = $isAr ? $faq->answer_ar : ($faq->answer_en ?: $faq->answer_ar);
                        if ($q && $a) {
                            $faqSection .= "\n- {$q}\n  {$a}";
                        }
                    }
                    $parts[] = $faqSection;
                }
            } catch (\Exception $e) {
                // Silently skip
            }

            // Recent news titles for awareness
            try {
                $recentNews = \App\Models\Content::where('status', 'published')
                    ->where('category', 'news')
                    ->orderByDesc('published_at')
                    ->limit(10)
                    ->get();
                if ($recentNews->isNotEmpty()) {
                    $newsSection = $isAr ? "\n\nآخر الأخبار:" : "\n\nLatest News:";
                    foreach ($recentNews as $news) {
                        $title = $isAr ? ($news->title_ar ?? $news->title_en) : ($news->title_en ?? $news->title_ar);
                        if ($title) $newsSection .= "\n- {$title}";
                    }
                    $parts[] = $newsSection;
                }
            } catch (\Exception $e) {
                // Silently skip
            }

            // Complaint/suggestion rules from settings
            try {
                $complaintRules = SystemSetting::get($isAr ? 'complaint_rules_ar' : 'complaint_rules_en');
                $suggestionRules = SystemSetting::get($isAr ? 'suggestion_rules_ar' : 'suggestion_rules_en');

                if ($complaintRules) {
                    $parts[] = ($isAr ? "\n\nقواعد تقديم الشكاوى:\n" : "\n\nComplaint Rules:\n") . Str::limit($complaintRules, 500);
                }
                if ($suggestionRules) {
                    $parts[] = ($isAr ? "\n\nقواعد تقديم المقترحات:\n" : "\n\nSuggestion Rules:\n") . Str::limit($suggestionRules, 500);
                }
            } catch (\Exception $e) {
                // Silently skip
            }

            // Final instruction
            if ($isAr) {
                $parts[] = "\n\nأجب بناءً على المعلومات أعلاه. إذا لم تجد الإجابة، يمكنك البحث في الإنترنت أو اقترح على المستخدم التواصل مع الوزارة عبر الخط الساخن 19999 أو البريد info@moe.gov.sy.";
            } else {
                $parts[] = "\n\nAnswer based on the above. If unsure, search the internet or suggest contacting the ministry via hotline 19999 or email info@moe.gov.sy.";
            }

            return implode('', $parts);
        });
    }

    /**
     * Notify staff about new handoff request
     */
    private function notifyStaffAboutHandoff(ChatConversation $conversation): void
    {
        try {
            $notificationService = app(\App\Services\NotificationService::class);

            // Notify all staff/admins
            $staffUsers = \App\Models\User::whereHas('role', function ($query) {
                $query->whereIn('name', ['staff', 'admin.general', 'admin.super']);
            })->get();

            foreach ($staffUsers as $staff) {
                $notificationService->notify(
                    $staff,
                    'handoff_request',
                    'طلب تحويل محادثة جديد',
                    'يوجد مستخدم يطلب التحدث مع موظف مختص',
                    [
                        'conversation_id' => $conversation->id,
                        'session_id' => $conversation->session_id,
                        'reason' => $conversation->handoff_reason,
                    ]
                );
            }
        } catch (\Exception $e) {
            \Log::error('Failed to notify staff about handoff', ['error' => $e->getMessage()]);
        }
    }
}
