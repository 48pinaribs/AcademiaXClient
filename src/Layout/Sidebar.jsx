import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import { getNavGroups } from './navConfig';

const roleLabel = {
    Administrator: 'Administrator',
    Teacher: 'Teacher',
    Student: 'Student',
};

const initialsFromEmail = (email) => {
    if (!email) return '?';
    const namePart = email.split('@')[0].replace(/[^a-zA-Z]/g, '');
    return (namePart.slice(0, 2) || '?').toUpperCase();
};

const Sidebar = () => {
    const { role, email } = useAuth();
    const navigate = useNavigate();
    const groups = getNavGroups(role);

    // Mobilde sidebar artık sabit bir sütun değil, soldan kayan bir çekmece (drawer) —
    // dar ekranda önceki "yatay sar" davranışı (flex-wrap) çok garip görünüyordu.
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeMobile = () => setMobileOpen(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <>
            <div className="ax-mobile-topbar">
                <NavLink to="/profilepage" className="ax-sidebar-brand" onClick={closeMobile}>
                    AcademiaX
                </NavLink>
                <button className="ax-menu-toggle" aria-label="Menüyü aç" onClick={() => setMobileOpen(true)}>☰</button>
            </div>

            <div className={`ax-sidebar-backdrop${mobileOpen ? ' open' : ''}`} onClick={closeMobile} aria-hidden="true" />

            <aside className={`ax-sidebar${mobileOpen ? ' open' : ''}`}>
                <button className="ax-sidebar-close" aria-label="Menüyü kapat" onClick={closeMobile}>✕</button>

                <NavLink to="/profilepage" className="ax-sidebar-brand" onClick={closeMobile}>
                    AcademiaX
                </NavLink>

                {groups.map((group) => (
                    <div className="ax-sidebar-group" key={group.label}>
                        <div className="ax-sidebar-label">{group.label}</div>
                        {group.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeMobile}
                                className={({ isActive }) => 'ax-sidebar-item' + (isActive ? ' active' : '')}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                ))}

                <div className="ax-sidebar-foot">
                    <NavLink to="/profilepage" className="ax-sidebar-who" style={{ textDecoration: 'none' }} onClick={closeMobile}>
                        <div className="ax-avatar" style={{ background: 'var(--purple)', color: '#2E1A40' }}>
                            {initialsFromEmail(email)}
                        </div>
                        <div>
                            <div className="who">{email || 'Kullanıcı'}</div>
                            <div className="role">{roleLabel[role] || role}</div>
                        </div>
                    </NavLink>
                    <button className="ax-sidebar-logout" onClick={handleLogout}>Çıkış Yap</button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
