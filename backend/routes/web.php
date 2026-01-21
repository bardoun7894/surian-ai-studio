<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Redirect /admin to custom dashboard
Route::get('/admin', function () {
    return redirect('/admin/dashboard');
});

Route::get('/login', function () {
    return redirect('/admin/login');
})->name('login');

// Custom Admin Dashboard Routes
require __DIR__.'/admin.php';
