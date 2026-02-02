<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    public function index()
    {
        $settingsGrouped = SystemSetting::all()->groupBy('group');
        return view('admin.system-settings.index', compact('settingsGrouped'));
    }

    public function update(Request $request)
    {
        $settings = $request->input('settings', []);

        foreach ($settings as $key => $value) {
            SystemSetting::set($key, $value);
        }

        return redirect()->route('admin.system-settings.index')->with('success', 'تم تحديث الإعدادات بنجاح');
    }
}
