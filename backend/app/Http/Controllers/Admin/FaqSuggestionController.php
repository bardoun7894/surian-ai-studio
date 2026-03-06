<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FaqSuggestion;
use Illuminate\Http\Request;

class FaqSuggestionController extends Controller
{
    public function index(Request $request)
    {
        $query = FaqSuggestion::latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('question_ar', 'like', "%{$search}%")
                  ->orWhere('question_en', 'like', "%{$search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $suggestions = $query->paginate(20);
        $pendingCount = FaqSuggestion::where('status', 'pending')->count();
        return view('admin.faq-suggestions.index', compact('suggestions', 'pendingCount'));
    }

    public function approve(Request $request, FaqSuggestion $faqSuggestion)
    {
        $notes = $request->input('review_notes');
        $faqSuggestion->approve(auth()->id(), $notes);
        return redirect()->route('admin.faq-suggestions.index')->with('success', 'تم قبول الاقتراح وإنشاء سؤال شائع جديد');
    }

    public function reject(Request $request, FaqSuggestion $faqSuggestion)
    {
        $notes = $request->input('review_notes');
        $faqSuggestion->reject(auth()->id(), $notes);
        return redirect()->route('admin.faq-suggestions.index')->with('success', 'تم رفض الاقتراح');
    }
}
