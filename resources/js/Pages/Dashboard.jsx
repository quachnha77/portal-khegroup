import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    FileText, 
    CalendarDays, 
    Package, 
    FileSignature, 
    Bell, 
    LayoutGrid
} from 'lucide-react';

export default function Dashboard({ auth }) {
    // Danh mục chức năng
    const modules = [
        { name: 'Tài nguyên nội bộ', desc: 'Quy trình, tài liệu công ty', icon: FileText, href: route('docs.index'), active: true, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Công ca & Chấm công', desc: 'Theo dõi lịch làm việc', icon: CalendarDays, href: '#', active: false, color: 'text-green-600', bg: 'bg-green-50' },
        { name: 'Quản lý tài sản', desc: 'Cấp phát thiết bị vật tư', icon: Package, href: '#', active: false, color: 'text-orange-600', bg: 'bg-orange-50' },
        { name: 'Đơn từ nội bộ', desc: 'Nghỉ phép, thanh toán', icon: FileSignature, href: '#', active: false, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    // Dữ liệu bài đăng thông báo mẫu
    const announcements = [
        { id: 1, title: "Thông báo nghỉ Tết Nguyên Đán 2026", date: "02/01/2026", tag: "Khẩn", color: "red" },
        { id: 2, title: "Cập nhật hệ thống NAS nội bộ KheGroup", date: "01/01/2026", tag: "Tin tức", color: "blue" },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Bảng điều khiển hệ thống</h2>}
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Phần 1: Lời chào mừng */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                    <div className="p-8 text-gray-900">
                        <h1 className="text-2xl font-bold">Chào mừng quay trở lại, {auth.user.name}! 👋</h1>
                        <p className="mt-2 text-gray-500">Hôm nay bạn muốn xử lý công việc gì tại KheGroup?</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Phần 2: Danh mục Module (2 cột) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <LayoutGrid size={20} className="text-gray-400" />
                            <h3 className="font-bold text-gray-700 uppercase tracking-wider text-sm">Chức năng hệ thống</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {modules.map((m, i) => (
                                <Link 
                                    key={i} 
                                    href={m.active ? m.href : '#'} 
                                    className={`p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all ${m.active ? 'hover:shadow-md hover:border-blue-200' : 'opacity-50 cursor-not-allowed'}`}
                                >
                                    <div className={`w-12 h-12 ${m.bg} ${m.color} rounded-lg flex items-center justify-center mb-4`}>
                                        <m.icon size={24} />
                                    </div>
                                    <h4 className="font-bold text-gray-800">{m.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{m.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Phần 3: Bảng tin thông báo (1 cột) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Bell size={20} className="text-gray-400" />
                            <h3 className="font-bold text-gray-700 uppercase tracking-wider text-sm">Thông báo mới</h3>
                        </div>
                        <div className="space-y-3">
                            {announcements.map((post) => (
                                <div key={post.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-${post.color}-50 text-${post.color}-600`}>
                                            {post.tag}
                                        </span>
                                        <span className="text-[11px] text-gray-400">{post.date}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 text-sm leading-snug">{post.title}</h4>
                                    <button className="mt-3 text-xs text-blue-600 font-semibold hover:underline">Xem chi tiết →</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}