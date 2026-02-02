<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterSubscriberController extends Controller
{
    public function index(Request $request)
    {
        $query = NewsletterSubscriber::latest();

        if ($request->filled('search')) {
            $query->where('email', 'like', "%{$request->search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $subscribers = $query->paginate(20);
        $totalActive = NewsletterSubscriber::where('status', 'active')->count();
        $totalUnsubscribed = NewsletterSubscriber::where('status', 'unsubscribed')->count();

        return view('admin.newsletter.index', compact('subscribers', 'totalActive', 'totalUnsubscribed'));
    }

    public function destroy(NewsletterSubscriber $subscriber)
    {
        $subscriber->delete();
        return redirect()->route('admin.newsletter.index')->with('success', 'تم حذف المشترك بنجاح');
    }
}
