import { router } from '@inertiajs/react';
import { 
    HomeOutlined, 
    FolderOpenOutlined, 
    UserOutlined, 
    AppstoreOutlined,
    PlusCircleFilled 
} from '@ant-design/icons';

export default function MobileNav({ activeKey }) {
    const navItems = [
        { key: 'dashboard', label: 'Tổng quan', icon: <AppstoreOutlined />, route: '/' },
        { key: 'documents', label: 'Tài liệu', icon: <FolderOpenOutlined />, route: '/documents' },
        { key: 'add', label: '', icon: <PlusCircleFilled className="text-4xl text-blue-600 -mt-6 shadow-lg bg-white rounded-full" />, route: '#' },
        { key: 'users', label: 'Nhân sự', icon: <UserOutlined />, route: '/admin/users' },
        { key: 'more', label: 'Thêm', icon: <HomeOutlined />, route: '#' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-end pb-safe z-50 h-16">
            {navItems.map((item) => (
                <div 
                    key={item.key}
                    onClick={() => item.route !== '#' && router.get(item.route)}
                    className={`flex flex-col items-center justify-center w-full h-full ${
                        activeKey === item.key ? 'text-blue-600' : 'text-gray-400'
                    }`}
                >
                    <span className="text-xl leading-none">{item.icon}</span>
                    {item.label && <span className="text-[10px] mt-1 font-medium">{item.label}</span>}
                </div>
            ))}
        </div>
    );
}