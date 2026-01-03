import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ProTable, ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, message, Tag, Space, Tooltip, Typography } from 'antd'; 
import { PlusOutlined, EditOutlined, KeyOutlined, SearchOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function UserManagement({ auth, users }) {
    const columns = [
        {
            title: 'Nhân sự',
            dataIndex: 'name',
            ellipsis: true,
            render: (text, record) => (
                <Space>
                    <div className="flex flex-col">
                        <Text strong className="text-sm md:text-base">{text}</Text>
                        <Text type="secondary" className="text-xs">{record.email}</Text>
                    </div>
                </Space>
            ),
        },
        { 
            title: 'Quyền hạn', 
            dataIndex: 'role',
            width: 90,
            search: false,
            render: (role) => (
                <Tag color={role === 'admin' ? 'red' : 'blue'} className="m-0 uppercase text-[10px]">
                    {role === 'admin' ? 'Admin' : 'Staff'}
                </Tag>
            )
        },
        { 
            title: 'Ngày tạo', 
            dataIndex: 'created_at', 
            valueType: 'date', 
            search: false,
            responsive: ['md'], 
        },
        {
            title: 'Thao tác',
            valueType: 'option',
            width: 80,
            fixed: 'right', 
            render: (_, record) => [
                // MODAL CHỈNH SỬA THÔNG TIN
                <ModalForm
                    key="edit"
                    title="Chỉnh sửa nhân sự"
                    trigger={<Button type="text" size="small" icon={<EditOutlined className="text-blue-600" />} />}
                    initialValues={record}
                    onFinish={async (values) => {
                        router.patch(route('users.update', record.id), values);
                        message.success('Đã cập nhật');
                        return true;
                    }}
                >
                    <ProFormText name="name" label="Họ tên" rules={[{required: true}]} />
                    <ProFormText name="email" label="Email" rules={[{required: true}]} />
                    <ProFormSelect
                        name="role"
                        label="Quyền hạn"
                        options={[{ label: 'Admin', value: 'admin' }, { label: 'Staff', value: 'staff' }]}
                    />
                </ModalForm>,
                
                // MODAL RESET MẬT KHẨU TÙY CHỌN
                <ModalForm
                    key="reset-pass"
                    title={`Đổi mật khẩu: ${record.name}`}
                    trigger={
                        <Tooltip title="Đổi mật khẩu">
                            <Button type="text" size="small" icon={<KeyOutlined className="text-orange-500" />} />
                        </Tooltip>
                    }
                    onFinish={async (values) => {
                        router.patch(route('users.update', record.id), { 
                            ...record, 
                            password: values.new_password 
                        });
                        message.success('Đã đổi mật khẩu thành công');
                        return true;
                    }}
                    modalProps={{
                        destroyOnClose: true, // Xóa trắng form sau khi đóng
                    }}
                >
                    <ProFormText.Password 
                        name="new_password" 
                        label="Mật khẩu mới" 
                        placeholder="Nhập mật khẩu bạn muốn thiết lập"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                            { min: 8, message: 'Mật khẩu phải ít nhất 8 ký tự' }
                        ]} 
                    />
                </ModalForm>
            ],
        },
    ];

    return (
        <AuthenticatedLayout header="Quản lý nhân sự">
            <Head title="Quản lý nhân sự" />
            
            <div className="p-0 md:p-6 bg-white md:bg-transparent min-h-screen pb-20 md:pb-0">
                <ProTable
                    headerTitle={<span className="text-base md:text-lg">Danh sách nhân sự</span>}
                    dataSource={users}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    onSubmit={(params) => router.get(route('users.index'), params)}
                    onReset={() => router.get(route('users.index'))}
                    search={{
                        filterType: 'light',
                        searchText: 'Tìm',
                    }}
                    options={{
                        search: {
                            placeholder: 'Tìm tên, email...',
                            prefix: <SearchOutlined />,
                        },
                        density: false,
                        setting: false,
                    }}
                    pagination={{
                        defaultPageSize: 10,
                        size: 'small',
                    }}
                    toolBarRender={() => [
                        <ModalForm
                            key="create"
                            title="Thêm nhân sự mới"
                            trigger={
                                <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600">
                                    <span className="hidden md:inline">Thêm mới</span>
                                </Button>
                            }
                            onFinish={async (values) => {
                                router.post(route('users.store'), values);
                                return true;
                            }}
                        >
                            <ProFormText name="name" label="Họ tên" rules={[{required: true}]} />
                            <ProFormText name="email" label="Email" rules={[{required: true}]} />
                            <ProFormText.Password name="password" label="Mật khẩu" rules={[{required: true}]} />
                            <ProFormSelect
                                name="role"
                                label="Quyền hạn"
                                initialValue="staff"
                                options={[{ label: 'Admin', value: 'admin' }, { label: 'Staff', value: 'staff' }]}
                            />
                        </ModalForm>
                    ]}
                />
            </div>
        </AuthenticatedLayout>
    );
}