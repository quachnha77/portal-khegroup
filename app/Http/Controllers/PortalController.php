<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PortalController extends Controller
{
    // ==========================================
    // QUẢN LÝ NHÂN SỰ (USER)
    // ==========================================
    
    public function userIndex(Request $request) {
        $query = User::query();

        // Tìm kiếm chung theo Tên hoặc Email
        if ($request->filled('name')) {
            $search = $request->input('name');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/UserManagement', [
            'users' => $query->latest()->get()
        ]);
    }

    public function userStore(Request $request) {
        if ($request->user()->role !== 'admin') abort(403);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'role' => 'required|in:admin,staff'
        ]);
        
        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);
        
        return back()->with('message', 'Đã tạo tài khoản thành công!');
    }

    public function userUpdate(Request $request, User $user) {
        if ($request->user()->role !== 'admin') abort(403);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,staff',
            'password' => 'nullable|min:8',
        ]);

        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->role = $data['role'];
        
        if ($request->filled('password')) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();
        return back()->with('message', 'Cập nhật nhân sự thành công!');
    }

    public function userDestroy(User $user) {
        if (auth()->id() === $user->id) {
            return back()->withErrors(['message' => 'Bạn không thể tự xóa chính mình.']);
        }
        $user->delete();
        return back()->with('message', 'Đã xóa nhân sự thành công!');
    }

    // ==========================================
    // QUẢN LÝ TÀI NGUYÊN (NAS DOCUMENTS)
    // ==========================================

    public function docIndex(Request $request) {
        $query = Document::query();

        // Lọc tài liệu theo tiêu đề nếu có tìm kiếm
        if ($request->filled('title')) {
            $query->where('title', 'like', "%{$request->title}%");
        }

        return Inertia::render('Documents/Index', [
            'documents' => $query->latest()->get(),
            'isAdmin' => $request->user()->role === 'admin',
        ]);
    }

    public function docUpload(Request $request) {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Chỉ Admin mới có quyền upload lên NAS.');
        }

        $request->validate([
            'title' => 'required|string',
            'category' => 'required',
            'file' => 'required|file|max:102400', 
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('nas_storage');

            Document::create([
                'title' => $request->title,
                'file_path' => $path,
                'category' => $request->category,
                'user_id' => auth()->id(), // THÊM DÒNG NÀY: Lưu ID người upload
            ]);
        }

        return back()->with('message', 'Tải lên NAS thành công!');
    }

    // HÀM GÂY LỖI TRƯỚC ĐÓ (Chỉ giữ lại 1 bản duy nhất ở đây)
    public function docDownload(Document $doc) {
        // 1. Kiểm tra xem bản ghi có tồn tại đường dẫn file không
        if (!$doc || empty($doc->file_path)) {
            return back()->withErrors(['message' => 'Lỗi: Dữ liệu đường dẫn tài liệu bị trống trong Database.']);
        }

        // 2. Kiểm tra file vật lý trên NAS (Z:\...)
        if (!Storage::exists($doc->file_path)) {
            abort(404, 'Tài liệu không tồn tại trên ổ đĩa NAS. Vui lòng kiểm tra lại kết nối ổ Z:');
        }
        
        // 3. Xử lý tên file khi tải về
        $extension = pathinfo($doc->file_path, PATHINFO_EXTENSION);
        $fullFileName = $doc->title . '.' . $extension;
        
        return Storage::download($doc->file_path, $fullFileName);
    }
}