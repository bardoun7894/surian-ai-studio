<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $query = Complaint::with(['user', 'directorate'])->latest();
        
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        
        $complaints = $query->paginate(20);
            
        return view('admin.complaints.index', compact('complaints'));
    }
    
    public function kanban()
    {
        $complaints = Complaint::with(['directorate', 'user'])->latest()->get();
        $grouped = $complaints->groupBy('status');
        
        return view('admin.complaints.kanban', compact('grouped'));
    }
    
    public function show(Complaint $complaint)
    {
        $complaint->load(['directorate', 'user', 'attachments', 'responses.user', 'template']);
        return view('admin.complaints.show', compact('complaint'));
    }
    
    public function updateStatus(Request $request, Complaint $complaint)
    {
        $request->validate([
            'status' => 'required|in:new,pending,processing,resolved,rejected',
        ]);

        $complaint->update(['status' => $request->status]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return back()->with('success', 'تم تحديث حالة الشكوى بنجاح');
    }

    public function addResponse(Request $request, Complaint $complaint)
    {
        $request->validate([
            'response' => 'required|string|max:5000',
            'is_internal' => 'nullable|boolean',
            'is_resolution' => 'nullable|boolean',
        ]);

        $complaint->responses()->create([
            'user_id' => $request->user()->id,
            'content' => $request->response,
            'is_internal' => $request->boolean('is_internal'),
            'is_resolution' => $request->boolean('is_resolution'),
        ]);

        // Auto-update status if marked as resolution
        if ($request->boolean('is_resolution') && $complaint->status !== 'resolved') {
            $complaint->update(['status' => 'resolved']);
        }

        return back()->with('success', 'تم إضافة الرد بنجاح');
    }
}
