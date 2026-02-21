<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubDirectorate;
use App\Models\Directorate;
use Illuminate\Http\Request;

class SubDirectorateController extends Controller
{
    public function index(Request $request)
    {
        $query = SubDirectorate::with('directorate')->orderBy('order');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name_ar', 'like', "%{$search}%")
                  ->orWhere('name_en', 'like', "%{$search}%");
        }

        if ($request->filled('directorate')) {
            $query->where('parent_directorate_id', $request->directorate);
        }

        $subDirectorates = $query->paginate(20);
        $directorates = Directorate::all();
        return view('admin.sub-directorates.index', compact('subDirectorates', 'directorates'));
    }

    public function create()
    {
        $directorates = Directorate::all();
        return view('admin.sub-directorates.create', compact('directorates'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'parent_directorate_id' => 'required|exists:directorates,id',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address_ar' => 'nullable|string|max:255',
            'address_en' => 'nullable|string|max:255',
            'url' => 'nullable|string|max:255',
            'is_external' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        $validated['is_external'] = $request->boolean('is_external');
        $validated['is_active'] = $request->boolean('is_active', true); // Default true if not sent but validated? Wait, let's keep boolean behavior

        SubDirectorate::create($validated);
        return redirect()->route('admin.sub-directorates.index')->with('success', 'تم إنشاء الإدارة الفرعية بنجاح');
    }

    public function edit(SubDirectorate $subDirectorate)
    {
        $directorates = Directorate::all();
        return view('admin.sub-directorates.edit', compact('subDirectorate', 'directorates'));
    }

    public function update(Request $request, SubDirectorate $subDirectorate)
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'parent_directorate_id' => 'required|exists:directorates,id',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address_ar' => 'nullable|string|max:255',
            'address_en' => 'nullable|string|max:255',
            'url' => 'nullable|string|max:255',
            'is_external' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        $validated['is_external'] = $request->boolean('is_external');
        $validated['is_active'] = $request->boolean('is_active', true);

        $subDirectorate->update($validated);
        return redirect()->route('admin.sub-directorates.index')->with('success', 'تم تحديث الإدارة الفرعية بنجاح');
    }

    public function destroy(SubDirectorate $subDirectorate)
    {
        $subDirectorate->delete();
        return redirect()->route('admin.sub-directorates.index')->with('success', 'تم حذف الإدارة الفرعية بنجاح');
    }
}
