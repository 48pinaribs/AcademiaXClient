import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="ax-shell">
            <Sidebar />
            <main className="ax-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
