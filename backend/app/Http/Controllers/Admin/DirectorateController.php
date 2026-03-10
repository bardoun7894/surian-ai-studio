<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Directorate;
use Illuminate\Http\Request;

class DirectorateController extends Controller
{
    public function index()
    {
        $directorates = Directorate::withCount(['users', 'complaints'])->latest()->paginate(20);
        return view('admin.directorates.index', compact('directorates'));
    }
    
    public function create()
    {
        return view('admin.directorates.create');
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:directorates,name',
            'description' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address_ar' => 'nullable|string|max:500',
            'address_en' => 'nullable|string|max:500',
            'website' => 'nullable|string|max:255',
            'working_hours_ar' => 'nullable|string|max:255',
            'working_hours_en' => 'nullable|string|max:255',
        ]);
        
        Directorate::create($validated);
        
        return redirect()->route('admin.directorates.index')->with('success', 'تم إضافة المديرية بنجاح');
    }
    
    public function edit(Directorate $directorate)
    {
        return view('admin.directorates.edit', compact('directorate'));
    }
    
    public function update(Request $request, Directorate $directorate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:directorates,name,' . $directorate->id,
            'description' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address_ar' => 'nullable|string|max:500',
            'address_en' => 'nullable|string|max:500',
            'website' => 'nullable|string|max:255',
            'working_hours_ar' => 'nullable|string|max:255',
            'working_hours_en' => 'nullable|string|max:255',
        ]);
        
        $directorate->update($validated);
        
        return redirect()->route('admin.directorates.index')->with('success', 'تم تحديث بيانات المديرية بنجاح');
    }
    
    public function destroy(Directorate $directorate)
    {
        if ($directorate->users()->count() > 0 || $directorate->complaints()->count() > 0) {
            return back()->with('error', 'لا يمكن حذف المديرية لوجود مستخدمين أو شكاوى مرتبطة بها');
        }
        
        $directorate->delete();
        return redirect()->route('admin.directorates.index')->with('success', 'تم حذف المديرية بنجاح');
    }
}
