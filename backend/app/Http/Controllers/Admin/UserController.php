<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('directorate')->latest();
        
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('father_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        if ($request->filled('role')) {
            $query->whereHas('role', function($q) use ($request) {
                $q->where('name', $request->role);
            });
        }
        
        $users = $query->paginate(20);
        return view('admin.users.index', compact('users'));
    }
    
    public function create()
    {
        $roles = \App\Models\Role::all();
        $directorates = \App\Models\Directorate::all();
        return view('admin.users.create', compact('roles', 'directorates'));
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'role' => 'required|exists:roles,name',
            'directorate_id' => 'nullable|exists:directorates,id',
            'phone' => 'nullable|string|max:20',
            'national_id' => 'nullable|string|max:50|unique:users,national_id',
            'birth_date' => 'nullable|date',
            'governorate' => 'nullable|string|max:255',
        ]);

        $role = Role::where('name', $validated['role'])->first();

        $user = User::create([
            'first_name' => $validated['first_name'],
            'father_name' => $validated['father_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'directorate_id' => $validated['directorate_id'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'national_id' => $validated['national_id'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'governorate' => $validated['governorate'] ?? null,
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        return redirect()->route('admin.users.index')->with('success', 'تم إنشاء المستخدم بنجاح');
    }
    
    public function edit(User $user)
    {
        $roles = \App\Models\Role::all();
        $directorates = \App\Models\Directorate::all();
        return view('admin.users.edit', compact('user', 'roles', 'directorates'));
    }
    
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:8|confirmed',
            'role' => 'required|exists:roles,name',
            'directorate_id' => 'nullable|exists:directorates,id',
            'phone' => 'nullable|string|max:20',
            'national_id' => ['nullable', 'string', 'max:50', Rule::unique('users')->ignore($user->id)],
            'birth_date' => 'nullable|date',
            'governorate' => 'nullable|string|max:255',
            'is_active' => 'nullable',
        ]);

        $role = Role::where('name', $validated['role'])->first();

        $data = [
            'first_name' => $validated['first_name'],
            'father_name' => $validated['father_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'role_id' => $role->id,
            'directorate_id' => $validated['directorate_id'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'national_id' => $validated['national_id'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'governorate' => $validated['governorate'] ?? null,
            'is_active' => $request->has('is_active'),
        ];

        if ($request->filled('password')) {
            $data['password'] = bcrypt($validated['password']);
        }

        $user->update($data);

        return redirect()->route('admin.users.index')->with('success', 'تم تحديث بيانات المستخدم بنجاح');
    }
    
    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'لا يمكنك حذف حسابك الحالي');
        }
        
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'تم حذف المستخدم بنجاح');
    }
}
