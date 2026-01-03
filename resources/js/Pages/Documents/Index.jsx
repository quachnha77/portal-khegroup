import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ProTable, ModalForm, ProFormText, ProFormSelect, ProFormUploadButton } from '@ant-design/pro-components';
import { Button, Tag, message, Tooltip, Typography, Space } from 'antd';
import { 
    DownloadOutlined, 
    UploadOutlined, 
    FileTextOutlined, 
    SearchOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

export default function DocumentIndex({ auth, documents, isAdmin }) {
    const canUpload = isAdmin || auth.user.role === 'admin';

    const categoryColors = {
        'Hành chính': 'magenta',
        'Kế toán': 'gold',
        'Kỹ thuật': 'geekblue',
        'Kinh doanh': 'green',
    };

    const columns = [
        {
            title: 'Tài liệu',
            dataIndex: 'title',
            className: 'font-medium',
            // ellipsis giúp tiêu đề không bị tràn trên màn hình nhỏ
            ellipsis: true,
            render: (text) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-500">
                        <FileTextOutlined style={{ fontSize: '18px' }} />
                    </div>
                    <Text strong className="hover:text-blue-600 transition-colors cursor-pointer truncate">
                        {text}
                    </Text>
                </div>
            )
        },
        {
            title: 'Phòng ban',
            dataIndex: 'category',
            width: 120,
            // Ẩn cột này trên điện thoại (màn hình < 768px) để ưu tiên tên tài liệu
            responsive: ['md'], 
            render: (cat) => (
                <Tag color={categoryColors[cat] || 'default'} className="rounded-full px-3">
                    {cat ? cat.toUpperCase() : 'N/A'}
                </Tag>
            )
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'created_at',
            valueType: 'date',
            width: 100,
            search: false,
            // Chỉ hiện trên màn hình máy tính lớn
            responsive: ['lg'],
            render: (text) => <Text type="secondary">{text}</Text>
        },
        {
            title: 'Hành động',
            valueType: 'option',
            width: 80,
            align: 'center',
            fixed: 'right', // Cố định nút tải về bên phải khi cuộn ngang trên mobile
            render: (_, record) => [
                <Tooltip title="Tải xuống từ NAS" key="download">
                    <Button 
                        type="primary" 
                        shape="circle" // Sử dụng nút tròn trên mobile để tiết kiệm diện tích
                        icon={<DownloadOutlined />} 
                        className="bg-blue-600 flex items-center justify-center"
                        href={route('docs.download', record.id)}
                    />
                </Tooltip>
            ],
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tài nguyên nội bộ - KheGroup" />
            
            <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <ProTable
                        headerTitle={
                            <div className="flex flex-col">
                                <Text strong className="text-base md:text-lg text-gray-800">Kho tài liệu KheGroup</Text>
                                <Text type="secondary" className="hidden md:block text-xs font-normal">Hệ thống lưu trữ dữ liệu NAS tập trung</Text>
                            </div>
                        }
                        dataSource={documents}
                        columns={columns}
                        rowKey="id"
                        // Cho phép cuộn ngang nếu màn hình quá bé
                        scroll={{ x: 'max-content' }}
                        pagination={{
                            defaultPageSize: 10,
                            size: 'small', // Phân trang nhỏ gọn hơn trên mobile
                        }}
                        
                        search={{
                            filterType: 'light', // Chế độ tìm kiếm rút gọn cho mobile
                            searchText: 'Tìm',
                        }}
                        options={{
                            search: {
                                placeholder: 'Tìm tài liệu...',
                                prefix: <SearchOutlined />,
                            },
                            reload: true,
                            setting: false, // Ẩn cài đặt cột để đỡ rối trên mobile
                        }}

                        onSubmit={(params) => router.get(route('docs.index'), params)}
                        onReset={() => router.get(route('docs.index'))}

                        toolBarRender={() => [
                            canUpload && (
                                <ModalForm
                                    key="upload-form"
                                    title="Tải lên tài liệu mới"
                                    // Trên mobile Modal sẽ tự động scale theo màn hình
                                    trigger={
                                        <Button 
                                            icon={<UploadOutlined />} 
                                            type="primary" 
                                            className="bg-blue-600 rounded-lg shadow-md"
                                        >
                                            <span className="hidden md:inline">Tải lên ngay</span>
                                            <span className="md:hidden">Tải lên</span>
                                        </Button>
                                    }
                                    onFinish={async (values) => {
                                        const formData = new FormData();
                                        formData.append('title', values.title);
                                        formData.append('category', values.category);
                                        formData.append('file', values.file[0].originFileObj);

                                        router.post(route('docs.upload'), formData, {
                                            forceFormData: true,
                                            onSuccess: () => message.success('Thành công'),
                                        });
                                        return true;
                                    }}
                                >
                                    <ProFormText 
                                        name="title" 
                                        label="Tiêu đề tài liệu" 
                                        rules={[{required: true}]} 
                                    />
                                    <ProFormSelect 
                                        name="category" 
                                        label="Phòng ban" 
                                        options={[
                                            { label: 'Hành chính', value: 'Hành chính' },
                                            { label: 'Kế toán', value: 'Kế toán' },
                                            { label: 'Kỹ thuật', value: 'Kỹ thuật' },
                                            { label: 'Kinh doanh', value: 'Kinh doanh' },
                                        ]} 
                                        rules={[{required: true}]}
                                    />
                                    <ProFormUploadButton 
                                        name="file" 
                                        label="Đính kèm tệp"
                                        max={1} 
                                        fieldProps={{ beforeUpload: () => false }}
                                        rules={[{required: true}]}
                                    />
                                </ModalForm>
                            )
                        ]}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}