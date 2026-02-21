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
     * Static context: ministry identity, contact info, and process guides.
     * Cached for 1 hour since this rarely changes.
     */
    private function getStaticContext(string $language): string
    {
        $cacheKey = "chatbot_static_context:{$language}";

        return Cache::remember($cacheKey, 3600, function () use ($language) {
            $isAr = $language === 'ar';
            $parts = [];

            // Identity
            if ($isAr) {
                $parts[] = "أنت المساعد الذكي لوزارة الاقتصاد والصناعة في سوريا. ساعد المواطنين والشركات في الوصول إلى المعلومات والخدمات. كن مهذباً ودقيقاً.";
            } else {
                $parts[] = "You are the AI assistant for Syria's Ministry of Economy and Industry. Help citizens and businesses access information and services. Be polite and accurate.";
            }

            // Contact info
            try {
                $contactPhone = SystemSetting::get('contact_phone');
                $contactEmail = SystemSetting::get('contact_email');
                if ($contactPhone || $contactEmail) {
                    $info = $isAr ? "\n\nمعلومات التواصل:" : "\n\nContact Information:";
                    if ($contactPhone) $info .= ($isAr ? " هاتف: " : " Phone: ") . $contactPhone;
                    if ($contactEmail) $info .= ($isAr ? " | بريد: " : " | Email: ") . $contactEmail;
                    $parts[] = $info;
                }
            } catch (\Exception $e) {
                // Skip
            }

            // Process guides (compact)
            if ($isAr) {
                $parts[] = "\n\nتقديم شكوى: صفحة الشكاوى ← الموافقة على الشروط ← البيانات الشخصية (أو مجهول) ← اختيار الإدارة ← كتابة التفاصيل ← إرفاق مستندات ← حفظ رقم التتبع.";
                $parts[] = "\nتقديم مقترح: صفحة المقترحات ← الموافقة على الشروط ← البيانات الشخصية (أو مجهول) ← اختيار الإدارة ← كتابة التفاصيل ← حفظ رقم التتبع.";
            } else {
                $parts[] = "\n\nSubmit complaint: Complaints page → Accept terms → Personal info (or anonymous) → Select directorate → Describe complaint → Attach documents → Save tracking number.";
                $parts[] = "\nSubmit suggestion: Suggestions page → Accept terms → Personal info (or anonymous) → Select directorate → Describe suggestion → Save tracking number.";
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
     */
    private function buildKnowledgeContextLegacy(string $language): string
    {
        $cacheKey = "chatbot_knowledge_context_legacy:{$language}";

        return Cache::remember($cacheKey, 1800, function () use ($language) {
            $isAr = $language === 'ar';
            $parts = [];

            // Base identity
            if ($isAr) {
                $parts[] = "أنت المساعد الذكي لوزارة الاقتصاد والصناعة في سوريا. دورك هو مساعدة المواطنين والشركات في الوصول إلى المعلومات والخدمات الحكومية. كن مهذباً واحترافياً وقدم إجابات دقيقة بناءً على سياق الوزارة. الاسم الرسمي هو 'وزارة الاقتصاد والصناعة'.";
            } else {
                $parts[] = "You are the AI assistant for the Ministry of Economy and Industry in Syria. Your role is to help citizens and businesses access government information and services. Be polite, professional, and provide accurate answers based on the ministry context. The official name is 'Ministry of Economy and Industry'.";
            }

            // FAQs
            try {
                $faqs = Faq::where('is_active', true)->where('is_published', true)->limit(20)->get();
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
                // Silently skip if FAQs table doesn't exist
            }

            // Directorates
            try {
                $directorates = Directorate::where('is_active', true)->get();
                if ($directorates->isNotEmpty()) {
                    $dirSection = $isAr ? "\n\nإدارات الوزارة:" : "\n\nMinistry Directorates:";
                    foreach ($directorates as $dir) {
                        $name = $isAr ? $dir->name_ar : ($dir->name_en ?: $dir->name_ar);
                        $dirSection .= "\n- {$name}";
                        if ($dir->phone) $dirSection .= ($isAr ? " | هاتف: " : " | Phone: ") . $dir->phone;
                        if ($dir->email) $dirSection .= ($isAr ? " | بريد: " : " | Email: ") . $dir->email;
                        if ($isAr && $dir->address_ar) $dirSection .= " | العنوان: " . $dir->address_ar;
                        if (!$isAr && ($dir->address_en ?: $dir->address_ar)) $dirSection .= " | Address: " . ($dir->address_en ?: $dir->address_ar);
                    }
                    $parts[] = $dirSection;
                }
            } catch (\Exception $e) {
                // Silently skip
            }

            // Settings: rules and contact info
            try {
                $complaintRules = SystemSetting::get($isAr ? 'complaint_rules_ar' : 'complaint_rules_en');
                $suggestionRules = SystemSetting::get($isAr ? 'suggestion_rules_ar' : 'suggestion_rules_en');
                $contactPhone = SystemSetting::get('contact_phone');
                $contactEmail = SystemSetting::get('contact_email');

                $infoSection = '';
                if ($complaintRules) {
                    $infoSection .= ($isAr ? "\n\nقواعد تقديم الشكاوى:\n" : "\n\nComplaint Submission Rules:\n") . $complaintRules;
                }
                if ($suggestionRules) {
                    $infoSection .= ($isAr ? "\n\nقواعد تقديم المقترحات:\n" : "\n\nSuggestion Submission Rules:\n") . $suggestionRules;
                }
                if ($contactPhone || $contactEmail) {
                    $infoSection .= $isAr ? "\n\nمعلومات التواصل:" : "\n\nContact Information:";
                    if ($contactPhone) $infoSection .= ($isAr ? "\nهاتف: " : "\nPhone: ") . $contactPhone;
                    if ($contactEmail) $infoSection .= ($isAr ? "\nبريد إلكتروني: " : "\nEmail: ") . $contactEmail;
                }
                if ($infoSection) $parts[] = $infoSection;
            } catch (\Exception $e) {
                // Silently skip
            }

            // Process guides
            if ($isAr) {
                $parts[] = "\n\nكيفية تقديم شكوى:\n1. انتقل إلى صفحة الشكاوى\n2. وافق على الشروط والضوابط\n3. أدخل بياناتك الشخصية أو اختر التقديم بشكل مجهول\n4. اختر الإدارة المعنية واكتب تفاصيل الشكوى\n5. أرفق المستندات الداعمة إن وجدت\n6. احتفظ برقم التتبع لمتابعة حالة الشكوى";
                $parts[] = "\nكيفية تقديم مقترح:\n1. انتقل إلى صفحة المقترحات\n2. وافق على الشروط والضوابط\n3. أدخل بياناتك الشخصية أو اختر التقديم بشكل مجهول\n4. اختر الإدارة المعنية واكتب تفاصيل المقترح\n5. احتفظ برقم التتبع لمتابعة حالة المقترح";
            } else {
                $parts[] = "\n\nHow to submit a complaint:\n1. Go to the complaints page\n2. Agree to the terms and conditions\n3. Enter your personal information or choose to submit anonymously\n4. Select the relevant directorate and describe your complaint\n5. Attach supporting documents if available\n6. Keep the tracking number to follow up on your complaint status";
                $parts[] = "\nHow to submit a suggestion:\n1. Go to the suggestions page\n2. Agree to the terms and conditions\n3. Enter your personal information or choose to submit anonymously\n4. Select the relevant directorate and describe your suggestion\n5. Keep the tracking number to follow up on your suggestion status";
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
