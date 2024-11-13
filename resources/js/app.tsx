import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ToastContainer } from "react-toastify";
import { ReactNode } from 'react';
import Authenticated from './Layouts/AuthenticatedLayout';
import Guest from './Layouts/GuestLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const page = resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        );

        page.then((module: any) => {
            module.default.layout = module.default.layout
                ? module.default.layout
                : name.startsWith("Authenticated/")
                ? (page: ReactNode) => <Authenticated children={page}/>
                : name.startsWith("Guest/")
                ? (page: ReactNode) => <Guest children={page}/>
                : undefined;
        });

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <ToastContainer stacked />
                <App {...props} />
            </>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
