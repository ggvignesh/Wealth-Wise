import React from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';

const FEATURES = [
  { icon: '📊', color: '#f0b429', bg: 'rgba(240,180,41,0.12)', title: 'Smart Analytics', desc: 'Visualize your financial health with interactive charts, spending trends, and AI-powered insights that make sense of your money.' },
  { icon: '🎯', color: '#34d399', bg: 'rgba(52,211,153,0.12)', title: 'Budget Control', desc: 'Set intelligent spending limits per category. Get real-time alerts before you overspend so you\'re always in control.' },
  { icon: '💼', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', title: 'Income Tracking', desc: 'Track multiple income sources — salary, freelance, investments — and see exactly how your earnings grow over time.' },
  { icon: '📅', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', title: 'Monthly Reports', desc: 'Get comprehensive monthly breakdowns with day-by-day spending patterns, category distributions and savings rates.' },
  { icon: '🗂️', color: '#f97316', bg: 'rgba(249,115,22,0.12)', title: 'Smart Categories', desc: '18+ built-in categories for income and expenses, with icons and color-coded tracking for instant recognition.' },
  { icon: '🔒', color: '#ec4899', bg: 'rgba(236,72,153,0.12)', title: 'Secure & Private', desc: 'Bank-grade JWT authentication. Your financial data is encrypted and never shared with third parties.' },
];

const STATS = [
  { value: '₹0', label: 'Hidden Fees' },
  { value: '18+', label: 'Categories' },
  { value: '100%', label: 'Secure' },
  { value: '∞', label: 'Transactions' },
];

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <PublicNav />

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content fade-up">
          <div className="hero-eyebrow">
            ✦ Your Personal Finance Intelligence Platform
          </div>
          <h1 className="hero-title">
            Master Your Money<br />
            with <span className="highlight">WealthWise</span>
          </h1>
          <p className="hero-subtitle">
            Track income, manage expenses, set budgets, and uncover powerful insights — all in one beautifully designed platform built for the modern Indian professional.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="cta-primary">
              Start Free Today →
            </Link>
            <Link to="/about" className="cta-secondary">
              Learn More
            </Link>
          </div>

          {/* Quick stats */}
          <div style={{
            display: 'flex', gap: 32, justifyContent: 'center',
            marginTop: 60, flexWrap: 'wrap'
          }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--accent-gold)' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-label">Everything you need</div>
          <h2>Finance Made <em style={{ fontStyle: 'normal', color: 'var(--accent-gold)' }}>Effortless</em></h2>
          <p>WealthWise combines powerful analytics with a clean interface to give you complete command of your finances.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="feature-icon" style={{ background: f.bg }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-bright)',
          borderRadius: 'var(--radius-xl)',
          padding: '60px 40px',
          maxWidth: 700,
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(240,180,41,0.06) 0%, transparent 70%)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💎</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 14 }}>
              Ready to Take Control?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
              Join thousands of smart professionals using WealthWise to build wealth, reduce waste, and achieve financial freedom.
            </p>
            <Link to="/register" className="cta-primary" style={{ fontSize: 16, padding: '16px 40px' }}>
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: 'var(--accent-gold)', color: '#080c14',
            width: 28, height: 28, borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700
          }}>💎</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>WealthWise</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          © 2024 WealthWise. Built with ❤️ for smart financial decisions.
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/about" style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' }}>About</Link>
          <Link to="/contact" style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' }}>Contact</Link>
          <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' }}>Login</Link>
        </div>
      </footer>
    </div>
  );
}
