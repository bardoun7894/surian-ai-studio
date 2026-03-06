<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::latest()->paginate(20);
        return view('admin.faqs.index', compact('faqs'));
    }
    
    public function create()
    {
        return view('admin.faqs.create');
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question_ar' => 'required|string',
            'question_en' => 'nullable|string',
            'answer_ar' => 'required|string',
            'answer_en' => 'nullable|string',
            'is_published' => 'nullable|boolean',
            'suggested_by_ai' => 'nullable|boolean',
        ]);
        
        // Handle checkbox boolean
        $validated['is_published'] = $request->has('is_published');
        $validated['suggested_by_ai'] = $request->has('suggested_by_ai');
        
        Faq::create($validated);
        
        return redirect()->route('admin.faqs.index')->with('success', 'تم إضافة السؤال بنجاح');
    }
    
    public function edit(Faq $faq)
    {
        return view('admin.faqs.edit', compact('faq'));
    }
    
    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question_ar' => 'required|string',
            'question_en' => 'nullable|string',
            'answer_ar' => 'required|string',
            'answer_en' => 'nullable|string',
            'is_published' => 'nullable|boolean',
            'suggested_by_ai' => 'nullable|boolean',
        ]);
        
        $validated['is_published'] = $request->has('is_published');
        $validated['suggested_by_ai'] = $request->has('suggested_by_ai');
        
        $faq->update($validated);
        
        return redirect()->route('admin.faqs.index')->with('success', 'تم تحديث السؤال بنجاح');
    }
    
    public function destroy(Faq $faq)
    {
        $faq->delete();
        return redirect()->route('admin.faqs.index')->with('success', 'تم حذف السؤال بنجاح');
    }
}
