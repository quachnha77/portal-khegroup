import '../css/app.css';
import './bootstrap';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ConfigProvider locale={viVN}>
                <App {...props} />
            </ConfigProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
