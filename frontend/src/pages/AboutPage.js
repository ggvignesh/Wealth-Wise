import React from 'react';
import PublicNav from '../components/PublicNav';
import { Link } from 'react-router-dom';

const TEAM = [
  { emoji: '👨‍💻', name: 'Gouri Vignesh', role: 'Full Stack Developer', desc: 'React, Python, Flask & MySQL specialist building scalable finance tools.' },
  { emoji: '📊', name: 'Analytics Engine', role: 'Data Intelligence', desc: 'Powered by SQL aggregations and real-time chart rendering for instant insights.' },
  { emoji: '🔐', name: 'Security Layer', role: 'Auth & Privacy', desc: 'JWT-based authentication with bcrypt password hashing keeping your data safe.' },
];

const VALUES = [
  { icon: '🎯', title: 'Precision', desc: 'Every rupee tracked. Every insight actionable.' },
  { icon: '🌱', title: 'Growth', desc: 'Tools that evolve with your financial journey.' },
  { icon: '🔍', title: 'Transparency', desc: 'No hidden fees. No dark patterns. Ever.' },
  { icon: '⚡', title: 'Speed', desc: 'Instant loading. Real-time updates. Zero lag.' },
];

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <PublicNav />

      {/* Hero */}
      <div className="about-hero">
        <div className="hero-eyebrow">Our Story</div>
        <h1 style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>
          Built for the Modern<br />
          <span style={{ color: 'var(--accent-gold)' }}>Indian Professional</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
          WealthWise was born from a simple frustration — managing personal finances in India required juggling multiple apps,
          spreadsheets, and bank statements. We built one platform to rule them all.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { n: '18+', d: 'Expense Categories' },
          { n: '6', d: 'Chart Types' },
          { n: '100%', d: 'Data Privacy' },
          { n: '₹0', d: 'Cost to Start' },
        ].map((s, i) => (
          <div key={i} className="stat-box fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="stat-number">{s.n}</div>
            <div className="stat-desc">{s.d}</div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <section style={{ padding: '40px 40px 80px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-green))'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-label" style={{ display: 'block', marginBottom: 12 }}>Our Mission</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>
              Democratizing Financial Intelligence
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
              Most financial tools are either too complex (built for accountants) or too simple (basic expense trackers).
              WealthWise sits right in the sweet spot — powerful enough for real insights, intuitive enough for daily use.
            </p>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              We believe everyone deserves the clarity that comes from understanding where their money goes, what their trends
              look like, and how to plan better — without a finance degree.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '0 40px 80px' }}>
        <div className="section-header" style={{ marginBottom: 40 }}>
          <div className="section-label">What We Stand For</div>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>Our Core Values</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {VALUES.map((v, i) => (
            <div key={i} className="feature-card" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{v.icon}</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{v.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '0 40px 80px' }}>
        <div className="section-header" style={{ marginBottom: 40 }}>
          <div className="section-label">Built By</div>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>The Stack Behind WealthWise</h2>
        </div>
        <div className="team-grid">
          {TEAM.map((m, i) => (
            <div key={i} className="team-card">
              <div className="team-avatar">{m.emoji}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{m.name}</h3>
              <div style={{ fontSize: 12, color: 'var(--accent-gold)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
                {m.role}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: '0 40px 100px', maxWidth: 900, margin: '0 auto' }}>
        <div className="card">
          <h3 className="section-title">🛠 Technology Stack</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { label: 'Frontend', items: ['React.js 18', 'React Router v6', 'Recharts', 'Framer Motion', 'CSS3 Variables'] },
              { label: 'Backend', items: ['Python 3.11', 'Flask 3.0', 'Flask-JWT-Extended', 'Flask-SQLAlchemy', 'Flask-CORS'] },
              { label: 'Database', items: ['MySQL 8.0', 'PyMySQL', 'SQLAlchemy ORM', 'Werkzeug Security', 'Bcrypt Hashing'] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: 12 }}>
                  {col.label}
                </div>
                {col.items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, background: 'var(--accent-gold)', borderRadius: '50%', flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
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
        flexWrap: 'wrap', gap: 16
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>© 2024 WealthWise. All rights reserved.</span>
        <Link to="/contact" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 20px' }}>Contact Us →</Link>
      </footer>
    </div>
  );
}
