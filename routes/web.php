<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PortalController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. Vào trang chủ là tự động đẩy sang trang Login
Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    
    // 2. Trang Dashboard MỚI: Hiển thị lời chào và danh mục chức năng
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard'); // Trỏ về file Dashboard.jsx (Trang chủ module)
    })->name('dashboard');

    // 3. Quản lý Profile cá nhân
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // 4. Quản lý User (Dành cho Admin)
    Route::get('/admin/users', [PortalController::class, 'userIndex'])->name('users.index');
    Route::post('/admin/users', [PortalController::class, 'userStore'])->name('users.store');
    Route::patch('/admin/users/{user}', [PortalController::class, 'userUpdate'])->name('users.update');
    Route::delete('/admin/users/{user}', [PortalController::class, 'userDestroy'])->name('users.destroy');

    // 5. Chức năng con: Kho Tài liệu nội bộ
    Route::get('/documents', [PortalController::class, 'docIndex'])->name('docs.index');
    Route::post('/documents/upload', [PortalController::class, 'docUpload'])->name('docs.upload');
    Route::get('/documents/download/{doc}', [PortalController::class, 'docDownload'])->name('docs.download');
});

require __DIR__.'/auth.php';