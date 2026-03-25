import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicNav() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="public-nav" style={{
      background: scrolled ? 'rgba(8,12,20,0.97)' : 'rgba(8,12,20,0.7)',
      boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none'
    }}>
      <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}>
        <div className="logo-badge">💎</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>WealthWise</span>
      </Link>

      <div className="public-nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>

        {user ? (
          <Link to="/dashboard" style={{
            background: 'var(--accent-gold)', color: '#080c14',
            padding: '8px 20px', borderRadius: '8px',
            fontWeight: 700, fontSize: 14, marginLeft: 8,
            textDecoration: 'none'
          }}>
            Dashboard →
          </Link>
        ) : (
          <>
            <Link to="/login" style={{ padding: '8px 16px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
              Sign In
            </Link>
            <Link to="/register" style={{
              background: 'var(--accent-gold)', color: '#080c14',
              padding: '8px 20px', borderRadius: '8px',
              fontWeight: 700, fontSize: 14, marginLeft: 4,
              textDecoration: 'none'
            }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
