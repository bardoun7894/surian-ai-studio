<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use Illuminate\Http\Request;

class SuggestionController extends Controller
{
    public function index(Request $request)
    {
        $query = Suggestion::with('user')->latest();

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
        return view('admin.suggestions.index', compact('suggestions'));
    }

    public function show(Suggestion $suggestion)
    {
        $suggestion->load('user', 'attachments', 'reviewer');
        return view('admin.suggestions.show', compact('suggestion'));
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

        return redirect()->route('admin.suggestions.show', $suggestion)->with('success', 'تم تحديث حالة المقترح بنجاح');
    }
}
