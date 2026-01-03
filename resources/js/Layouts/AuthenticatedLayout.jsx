import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    LayoutDashboard, 
    FileText, 
    CalendarDays, 
    Package, 
    FileSignature, 
    Users,
    ChevronRight,
    Home,
    PlusCircle,
    Settings,
    Menu
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Danh sách Menu chính
    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, current: route().current('dashboard'), key: 'dashboard' },
        { name: 'Tài liệu', href: route('docs.index'), icon: FileText, current: route().current('docs.index'), key: 'documents' },
        { name: 'Công ca', href: '#', icon: CalendarDays, current: false, status: 'soon' },
        { name: 'Tài sản', href: '#', icon: Package, current: false, status: 'soon' },
    ];

    const adminNavigation = [
        { name: 'Nhân sự', href: route('users.index'), icon: Users, current: route().current('users.index'), key: 'users' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* --- SIDEBAR (DESKTOP) --- */}
            <aside className={`hidden md:flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
                    <Link href="/" className="flex items-center">
                        <ApplicationLogo className="h-8 w-8 fill-current text-blue-600" />
                        {isSidebarOpen && <span className="ml-3 font-bold text-gray-800 text-lg tracking-tight">KheGroup</span>}
                    </Link>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-2 px-3 tracking-widest">
                        {isSidebarOpen ? 'Chức năng chính' : '...'}
                    </div>
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center p-2.5 rounded-xl transition-all ${
                                item.current ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {isSidebarOpen && (
                                <span className="ml-3 text-sm font-medium flex-1 truncate">
                                    {item.name}
                                    {item.status === 'soon' && (
                                        <span className="ml-2 text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full uppercase">Sắp có</span>
                                    )}
                                </span>
                            )}
                        </Link>
                    ))}

                    {user.role === 'admin' && (
                        <div className="mt-6">
                            <div className="text-[10px] font-bold text-gray-400 uppercase mb-2 px-3 tracking-widest">
                                {isSidebarOpen ? 'Hệ thống' : '...'}
                            </div>
                            {adminNavigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center p-2.5 rounded-xl transition-all ${
                                        item.current ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {isSidebarOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
                                </Link>
                            ))}
                        </div>
                    )}
                </nav>
            </aside>

            {/* --- MAIN AREA --- */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* TOPBAR (Desktop & Mobile) */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-20">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                            <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {/* Mobile Logo */}
                        <div className="md:hidden flex items-center">
                            <ApplicationLogo className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 font-bold text-gray-800 uppercase tracking-wider">KheGroup</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center text-sm font-medium text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-all">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-2 shadow-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="hidden sm:inline">{user.name}</span>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Hồ sơ cá nhân</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Đăng xuất</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                    {header && (
                        <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 sticky top-0 z-10 shadow-sm md:shadow-none">
                            <h2 className="font-bold text-lg md:text-xl text-gray-800 leading-tight">{header}</h2>
                        </div>
                    )}
                    <div className="p-4 md:p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* --- BOTTOM NAV (MOBILE ONLY) --- */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around px-2 z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                    <Link href={route('dashboard')} className={`flex flex-col items-center p-2 ${route().current('dashboard') ? 'text-blue-600' : 'text-gray-400'}`}>
                        <Home className="h-5 w-5" />
                        <span className="text-[10px] mt-1 font-medium">Trang chủ</span>
                    </Link>
                    <Link href={route('docs.index')} className={`flex flex-col items-center p-2 ${route().current('docs.index') ? 'text-blue-600' : 'text-gray-400'}`}>
                        <FileText className="h-5 w-5" />
                        <span className="text-[10px] mt-1 font-medium">Tài liệu</span>
                    </Link>
                    
                    {/* Floating Action Button phong cách 1Office */}
                    <div className="relative -mt-8">
                        <button className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white active:scale-95 transition-transform">
                            <PlusCircle className="h-6 w-6" />
                        </button>
                    </div>

                    <Link href={route('users.index')} className={`flex flex-col items-center p-2 ${route().current('users.index') ? 'text-blue-600' : 'text-gray-400'}`}>
                        <Users className="h-5 w-5" />
                        <span className="text-[10px] mt-1 font-medium">Nhân sự</span>
                    </Link>
                    <button className="flex flex-col items-center p-2 text-gray-400">
                        <Menu className="h-5 w-5" />
                        <span className="text-[10px] mt-1 font-medium">Thêm</span>
                    </button>
                </div>
            </div>
        </div>
    );
}