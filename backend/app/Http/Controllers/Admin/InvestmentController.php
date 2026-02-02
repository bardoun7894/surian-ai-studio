<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Investment;
use Illuminate\Http\Request;

class InvestmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Investment::latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('title_ar', 'like', "%{$search}%")
                  ->orWhere('title_en', 'like', "%{$search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $investments = $query->paginate(20);
        return view('admin.investments.index', compact('investments'));
    }

    public function create()
    {
        return view('admin.investments.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_ar' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'sector_ar' => 'nullable|string|max:255',
            'sector_en' => 'nullable|string|max:255',
            'location_ar' => 'nullable|string|max:255',
            'location_en' => 'nullable|string|max:255',
            'investment_amount' => 'nullable|numeric',
            'currency' => 'nullable|string|max:10',
            'status' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        $validated['is_active'] = $request->boolean('is_active');
        $validated['is_featured'] = $request->boolean('is_featured');

        Investment::create($validated);
        return redirect()->route('admin.investments.index')->with('success', 'تم إنشاء الفرصة الاستثمارية بنجاح');
    }

    public function edit(Investment $investment)
    {
        return view('admin.investments.edit', compact('investment'));
    }

    public function update(Request $request, Investment $investment)
    {
        $validated = $request->validate([
            'title_ar' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'sector_ar' => 'nullable|string|max:255',
            'sector_en' => 'nullable|string|max:255',
            'location_ar' => 'nullable|string|max:255',
            'location_en' => 'nullable|string|max:255',
            'investment_amount' => 'nullable|numeric',
            'currency' => 'nullable|string|max:10',
            'status' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        $validated['is_active'] = $request->boolean('is_active');
        $validated['is_featured'] = $request->boolean('is_featured');

        $investment->update($validated);
        return redirect()->route('admin.investments.index')->with('success', 'تم تحديث الفرصة الاستثمارية بنجاح');
    }

    public function destroy(Investment $investment)
    {
        $investment->delete();
        return redirect()->route('admin.investments.index')->with('success', 'تم حذف الفرصة الاستثمارية بنجاح');
    }
}
