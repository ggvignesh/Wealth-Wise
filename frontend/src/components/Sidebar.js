import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { path: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { path: '/transactions', icon: '↕', label: 'Transactions' },
  { path: '/analytics', icon: '◎', label: 'Analytics' },
  { path: '/budgets', icon: '◈', label: 'Budgets' },
  { path: '/reports', icon: '▦', label: 'Reports' },
];

const PUBLIC_ITEMS = [
  { path: '/', icon: '⌂', label: 'Home' },
  { path: '/about', icon: '◉', label: 'About' },
  { path: '/contact', icon: '✉', label: 'Contact' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: 'none',
          position: 'fixed', top: 16, left: 16,
          zIndex: 200,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          width: 40, height: 40,
          borderRadius: '10px',
          fontSize: 18,
          alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}
        className="mobile-menu-btn"
      >
        ☰
      </button>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 98
          }}
        />
      )}

      <aside className="sidebar" style={{ transform: mobileOpen ? 'translateX(0)' : undefined }}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">💎</div>
            <div>
              <div className="logo-text">WealthWise</div>
              <div className="logo-sub">Finance Intelligence</div>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <div className="nav-section-label" style={{ marginTop: 20 }}>Company</div>
          {PUBLIC_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
              end
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <div className="nav-section-label" style={{ marginTop: 20 }}>Account</div>
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="nav-icon">◌</span>
            Profile
          </NavLink>
          <button
            onClick={handleLogout}
            className="nav-item"
            style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', color: 'var(--accent-red)', cursor: 'pointer' }}
          >
            <span className="nav-icon">⇥</span>
            Logout
          </button>
        </nav>

        {/* User chip */}
        <div className="sidebar-footer">
          <NavLink to="/profile" className="user-chip" style={{ textDecoration: 'none' }}>
            <div className="user-avatar">{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </div>
              <div className="user-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
