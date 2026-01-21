<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ComplaintTemplate;
use App\Models\Directorate;
use Illuminate\Http\Request;

class ComplaintFormController extends Controller
{
    public function index()
    {
        $templates = ComplaintTemplate::with('directorate')->latest()->paginate(10);
        return view('admin.complaints.forms.index', compact('templates'));
    }

    public function create()
    {
        $directorates = Directorate::all();
        return view('admin.complaints.forms.create', compact('directorates'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'directorate_id' => 'required|exists:directorates,id',
            'fields' => 'required|array',
            'fields.*.label' => 'required|string',
            'fields.*.type' => 'required|in:text,textarea,number,date,file',
            'fields.*.required' => 'boolean',
        ]);

        ComplaintTemplate::create($request->all());

        return redirect()->route('admin.complaints.forms.index')
            ->with('success', 'تم إنشاء النموذج بنجاح');
    }

    public function edit(ComplaintTemplate $form)
    {
        $directorates = Directorate::all();
        return view('admin.complaints.forms.edit', compact('form', 'directorates'));
    }

    public function update(Request $request, ComplaintTemplate $form)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'directorate_id' => 'required|exists:directorates,id',
            'fields' => 'required|array',
        ]);

        $form->update($request->all());

        return redirect()->route('admin.complaints.forms.index')
            ->with('success', 'تم تحديث النموذج بنجاح');
    }

    public function destroy(ComplaintTemplate $form)
    {
        $form->delete();
        return back()->with('success', 'تم حذف النموذج بنجاح');
    }
}
