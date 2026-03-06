<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/admin/dashboard');
});

Route::get('/login', function () {
    return redirect('/admin/login');
})->name('login');

// Custom Admin Dashboard Routes (Blade-based UI)
require __DIR__.'/admin.php';
