<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Directorate;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::with('directorate')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name_ar', 'like', "%{$search}%")
                  ->orWhere('name_en', 'like', "%{$search}%");
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $services = $query->paginate(20);
        return view('admin.services.index', compact('services'));
    }

    public function create()
    {
        $directorates = Directorate::all();
        return view('admin.services.create', compact('directorates'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'directorate_id' => 'nullable|exists:directorates,id',
            'icon' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'is_digital' => 'boolean',
            'is_active' => 'boolean',
            'url' => 'nullable|string|max:255',
            'fees' => 'nullable|string|max:255',
            'estimated_time' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'display_order' => 'nullable|integer',
        ]);

        $validated['is_digital'] = $request->boolean('is_digital');
        $validated['is_active'] = $request->boolean('is_active');

        Service::create($validated);
        return redirect()->route('admin.services.index')->with('success', 'تم إنشاء الخدمة بنجاح');
    }

    public function edit(Service $service)
    {
        $directorates = Directorate::all();
        return view('admin.services.edit', compact('service', 'directorates'));
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'directorate_id' => 'nullable|exists:directorates,id',
            'icon' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'is_digital' => 'boolean',
            'is_active' => 'boolean',
            'url' => 'nullable|string|max:255',
            'fees' => 'nullable|string|max:255',
            'estimated_time' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'display_order' => 'nullable|integer',
        ]);

        $validated['is_digital'] = $request->boolean('is_digital');
        $validated['is_active'] = $request->boolean('is_active');

        $service->update($validated);
        return redirect()->route('admin.services.index')->with('success', 'تم تحديث الخدمة بنجاح');
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return redirect()->route('admin.services.index')->with('success', 'تم حذف الخدمة بنجاح');
    }
}
