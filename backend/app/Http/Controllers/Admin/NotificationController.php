<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Notification::with('user')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('body', 'like', "%{$search}%");
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $notifications = $query->paginate(20);
        $unreadCount = Notification::where('is_read', false)->count();
        return view('admin.notifications.index', compact('notifications', 'unreadCount'));
    }

    public function show(Notification $notification)
    {
        $notification->markAsRead();
        $notification->load('user');
        return view('admin.notifications.show', compact('notification'));
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();
        return redirect()->route('admin.notifications.index')->with('success', 'تم حذف الإشعار بنجاح');
    }
}
