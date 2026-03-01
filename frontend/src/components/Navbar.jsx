import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Shirt, Eraser, BarChart3, User, Sparkles, Watch } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">StyleSync</div>
            <div className="nav-links">
                <NavLink
                    to="/"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </div>
                </NavLink>
                <NavLink
                    to="/closet"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Shirt size={20} />
                        My Closet
                    </div>
                </NavLink>
                <NavLink
                    to="/accessories"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Watch size={20} />
                        Accessories
                    </div>
                </NavLink>
                <NavLink
                    to="/outfits"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Sparkles size={20} />
                        Outfit Maker
                    </div>
                </NavLink>
                <NavLink
                    to="/laundry"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Eraser size={20} />
                        Laundry
                    </div>
                </NavLink>
                <NavLink
                    to="/analytics"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <BarChart3 size={20} />
                        Insights
                    </div>
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <User size={20} />
                        My Profile
                    </div>
                </NavLink>
            </div>
        </nav>
    );
};

export default Navbar;
