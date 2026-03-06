<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Enums\Permission;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $query = Role::withCount('users')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('label', 'like', "%{$search}%");
        }

        $roles = $query->paginate(20);
        return view('admin.roles.index', compact('roles'));
    }

    public function create()
    {
        $permissionGroups = Permission::grouped();
        return view('admin.roles.create', compact('permissionGroups'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'label' => 'required|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        Role::create([
            'name' => $validated['name'],
            'label' => $validated['label'],
            'permissions' => $validated['permissions'] ?? [],
        ]);

        return redirect()->route('admin.roles.index')->with('success', 'تم إنشاء الدور بنجاح');
    }

    public function edit(Role $role)
    {
        $permissionGroups = Permission::grouped();
        return view('admin.roles.edit', compact('role', 'permissionGroups'));
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'label' => 'required|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $role->update([
            'name' => $validated['name'],
            'label' => $validated['label'],
            'permissions' => $validated['permissions'] ?? [],
        ]);

        return redirect()->route('admin.roles.index')->with('success', 'تم تحديث الدور بنجاح');
    }

    public function destroy(Role $role)
    {
        if ($role->users()->count() > 0) {
            return back()->with('error', 'لا يمكن حذف دور مرتبط بمستخدمين');
        }

        $role->delete();
        return redirect()->route('admin.roles.index')->with('success', 'تم حذف الدور بنجاح');
    }
}
