<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Directorate;
use App\Models\Suggestion;
use App\Models\SuggestionRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SuggestionController extends Controller
{
    public function index(Request $request)
    {
        $query = Suggestion::with(['user', 'directorate'])->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('tracking_number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $suggestions = $query->paginate(20);

        // Rating stats
        $ratingStats = SuggestionRating::selectRaw('ROUND(AVG(rating), 1) as avg_rating, COUNT(*) as total_rated')
            ->first();

        return view('admin.suggestions.index', compact('suggestions', 'ratingStats'));
    }

    public function kanban()
    {
        $suggestions = Suggestion::with(['directorate', 'user'])->latest()->get();
        $grouped = $suggestions->groupBy('status');
        $directorates = Directorate::where('is_active', true)->orderBy('name_ar')->get();

        return view('admin.suggestions.kanban', compact('grouped', 'directorates'));
    }

    public function show(Suggestion $suggestion)
    {
        $suggestion->load('user', 'attachments', 'reviewer', 'directorate');

        // Load rating for this suggestion
        $rating = SuggestionRating::where('tracking_number', $suggestion->tracking_number)->first();

        return view('admin.suggestions.show', compact('suggestion', 'rating'));
    }

    public function updateStatus(Request $request, Suggestion $suggestion)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,reviewed,approved,rejected',
            'response' => 'nullable|string',
        ]);

        $suggestion->updateStatus(
            $validated['status'],
            auth()->id(),
            $validated['response'] ?? null
        );

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->route('admin.suggestions.show', $suggestion)->with('success', 'تم تحديث حالة المقترح بنجاح');
    }
}
