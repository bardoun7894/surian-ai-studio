<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuickLink;
use Illuminate\Http\Request;

class QuickLinkController extends Controller
{
    public function index(Request $request)
    {
        $query = QuickLink::orderBy('display_order');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('label_ar', 'like', "%{$search}%")
                  ->orWhere('label_en', 'like', "%{$search}%");
        }

        $links = $query->paginate(20);
        return view('admin.quick-links.index', compact('links'));
    }

    public function create()
    {
        return view('admin.quick-links.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label_ar' => 'required|string|max:255',
            'label_en' => 'nullable|string|max:255',
            'url' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'section' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active');

        QuickLink::create($validated);
        return redirect()->route('admin.quick-links.index')->with('success', 'تم إنشاء الرابط السريع بنجاح');
    }

    public function edit(QuickLink $quickLink)
    {
        return view('admin.quick-links.edit', compact('quickLink'));
    }

    public function update(Request $request, QuickLink $quickLink)
    {
        $validated = $request->validate([
            'label_ar' => 'required|string|max:255',
            'label_en' => 'nullable|string|max:255',
            'url' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'section' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active');

        $quickLink->update($validated);
        return redirect()->route('admin.quick-links.index')->with('success', 'تم تحديث الرابط السريع بنجاح');
    }

    public function destroy(QuickLink $quickLink)
    {
        $quickLink->delete();
        return redirect()->route('admin.quick-links.index')->with('success', 'تم حذف الرابط السريع بنجاح');
    }
}
