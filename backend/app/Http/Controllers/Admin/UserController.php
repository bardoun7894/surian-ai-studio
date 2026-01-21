<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('directorate')->latest();
        
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'role' => 'required|exists:roles,name',
            'directorate_id' => 'nullable|exists:directorates,id',
        ]);
        
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'directorate_id' => $validated['directorate_id'] ?? null,
        ]);
        
        $user->assignRole($validated['role']);
        
        // Notify user via email (Mock)
        // \Mail::to($user)->send(new WelcomeEmail($user));
        
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:8|confirmed',
            'role' => 'required|exists:roles,name',
            'directorate_id' => 'nullable|exists:directorates,id',
        ]);
        
        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'directorate_id' => $validated['directorate_id'] ?? null,
        ];
        
        if ($request->filled('password')) {
            $data['password'] = bcrypt($validated['password']);
        }
        
        $user->update($data);
        $user->syncRoles([$validated['role']]);
        
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
