import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return toast.error('Please fill all required fields');
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <PublicNav />

      {/* Hero */}
      <div style={{ paddingTop: 120, textAlign: 'center', paddingBottom: 60 }}>
        <div className="hero-eyebrow" style={{ display: 'inline-flex', marginBottom: 16 }}>
          ✉ Get In Touch
        </div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
          We'd Love to Hear<br />
          <span style={{ color: 'var(--accent-gold)' }}>From You</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
          Have a question, suggestion, or just want to say hello? Drop us a message and we'll respond promptly.
        </p>
      </div>

      <div className="contact-grid">
        {/* Contact Info */}
        <div>
          <div className="contact-info-card">
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Contact Information</h2>

            <div className="contact-item">
              <div className="contact-item-icon">📧</div>
              <div>
                <div className="contact-item-label">Email Address</div>
                <div className="contact-item-value">
                  <a href="mailto:ggvignesh15@gmail.com" style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>
                    ggvignesh15@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-item-icon">📞</div>
              <div>
                <div className="contact-item-label">Contact Number</div>
                <div className="contact-item-value">
                  <a href="tel:+919182548143" style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>
                    +91 9182548143
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-item-icon">📍</div>
              <div>
                <div className="contact-item-label">Location</div>
                <div className="contact-item-value">Visakhapatnam, Andhra Pradesh, India</div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-item-icon">🕐</div>
              <div>
                <div className="contact-item-label">Response Time</div>
                <div className="contact-item-value">Within 24 hours</div>
              </div>
            </div>
          </div>

          {/* Quick Links — using React Router Link (no new tab, no 404) */}
          <div style={{
            marginTop: 20,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 24
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Links</h3>
            {[
              { icon: '📊', label: 'View Dashboard', to: '/dashboard' },
              { icon: 'ℹ️', label: 'About WealthWise', to: '/about' },
              { icon: '🚀', label: 'Get Started Free', to: '/register' },
            ].map((l, i) => (
              <Link
                key={i}
                to={l.to}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0',
                  borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                  color: 'var(--text-secondary)', textDecoration: 'none',
                  fontSize: 14, fontWeight: 500,
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <span>{l.icon}</span>
                {l.label}
                <span style={{ marginLeft: 'auto', fontSize: 12 }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-card">
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Send a Message</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>
            Fill out the form below and we'll respond as soon as possible.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <select
                className="form-input"
                value={form.subject}
                onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
              >
                <option value="">Select a topic...</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Report a Bug</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                className="form-input"
                rows={6}
                placeholder="Tell us what's on your mind..."
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                style={{ resize: 'vertical', minHeight: 140 }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}
              disabled={sending}
            >
              {sending ? '⏳ Sending...' : '📤 Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 40px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 13,
        marginTop: 40
      }}>
        © {new Date().getFullYear()} WealthWise. All rights reserved. | Made with ❤️ in Visakhapatnam, Andhra Pradesh, India
      </footer>
    </div>
  );
}
