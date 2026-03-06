<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ComplaintTemplate;
use App\Models\Directorate;
use Illuminate\Http\Request;

class ComplaintTemplateController extends Controller
{
    public function index(Request $request)
    {
        $query = ComplaintTemplate::with('directorate')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('name_en', 'like', "%{$search}%");
        }

        $templates = $query->paginate(20);
        return view('admin.complaint-templates.index', compact('templates'));
    }

    public function create()
    {
        $directorates = Directorate::all();
        return view('admin.complaint-templates.create', compact('directorates'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'directorate_id' => 'nullable|exists:directorates,id',
            'type' => 'nullable|string|max:255',
            'requires_identification' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $validated['requires_identification'] = $request->boolean('requires_identification');
        $validated['is_active'] = $request->boolean('is_active');

        ComplaintTemplate::create($validated);
        return redirect()->route('admin.complaint-templates.index')->with('success', 'تم إنشاء القالب بنجاح');
    }

    public function edit(ComplaintTemplate $complaintTemplate)
    {
        $directorates = Directorate::all();
        return view('admin.complaint-templates.edit', compact('complaintTemplate', 'directorates'));
    }

    public function update(Request $request, ComplaintTemplate $complaintTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'directorate_id' => 'nullable|exists:directorates,id',
            'type' => 'nullable|string|max:255',
            'requires_identification' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $validated['requires_identification'] = $request->boolean('requires_identification');
        $validated['is_active'] = $request->boolean('is_active');

        $complaintTemplate->update($validated);
        return redirect()->route('admin.complaint-templates.index')->with('success', 'تم تحديث القالب بنجاح');
    }

    public function destroy(ComplaintTemplate $complaintTemplate)
    {
        $complaintTemplate->delete();
        return redirect()->route('admin.complaint-templates.index')->with('success', 'تم حذف القالب بنجاح');
    }
}
