<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatConversation;
use Illuminate\Http\Request;

class ChatConversationController extends Controller
{
    public function index(Request $request)
    {
        $query = ChatConversation::with('user')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('session_id', 'like', "%{$search}%");
        }

        if ($request->filled('handoff')) {
            $query->where('handoff_requested', $request->handoff === 'yes');
        }

        $conversations = $query->paginate(20);
        $totalConversations = ChatConversation::count();
        $handoffCount = ChatConversation::where('handoff_requested', true)->count();
        return view('admin.chat-conversations.index', compact('conversations', 'totalConversations', 'handoffCount'));
    }

    public function show(ChatConversation $chatConversation)
    {
        $chatConversation->load('user', 'assignedTo');
        return view('admin.chat-conversations.show', compact('chatConversation'));
    }
}
