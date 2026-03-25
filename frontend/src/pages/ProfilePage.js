import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    currency: user?.currency || 'INR',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState('profile');

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, currency: form.currency };
      if (form.new_password) {
        if (form.new_password !== form.confirm_password) {
          toast.error('New passwords do not match');
          setLoading(false);
          return;
        }
        if (form.new_password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        payload.current_password = form.current_password;
        payload.new_password = form.new_password;
      }
      const res = await api.put('/auth/update', payload);
      updateUser(res.data.user);
      toast.success('Profile updated!');
      setForm(p => ({ ...p, current_password: '', new_password: '', confirm_password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const joinedDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '';

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Profile Settings</h1>
          <p>Manage your account preferences and security</p>
        </div>

        <div className="dashboard-body">
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, maxWidth: 900 }}>
            {/* Profile card */}
            <div>
              <div className="card" style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 80, height: 80,
                  background: 'var(--accent-gold)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, fontWeight: 800, color: '#080c14',
                  margin: '0 auto 16px',
                  fontFamily: 'var(--font-display)'
                }}>
                  {initials}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{user?.name}</h3>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{user?.email}</div>
                <div className="badge badge-gold">Member since {joinedDate}</div>
              </div>

              {/* Quick info */}
              <div className="card">
                <div className="section-title" style={{ fontSize: 13, marginBottom: 14 }}>Account Info</div>
                {[
                  { label: 'Full Name', val: user?.name },
                  { label: 'Email', val: user?.email },
                  { label: 'Currency', val: user?.currency || 'INR' },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{item.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit form */}
            <div className="card">
              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--bg-secondary)', borderRadius: 10, padding: 4 }}>
                {[
                  { key: 'profile', label: '👤 Profile' },
                  { key: 'security', label: '🔒 Security' },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setSection(tab.key)}
                    style={{
                      flex: 1, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                      background: section === tab.key ? 'var(--bg-card)' : 'transparent',
                      color: section === tab.key ? 'var(--accent-gold)' : 'var(--text-muted)',
                      border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleProfileSave}>
                {section === 'profile' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-input" value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-input" value={user?.email} disabled
                        style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Email cannot be changed</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Default Currency</label>
                      <select className="form-input" value={form.currency}
                        onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
                        <option value="INR">🇮🇳 INR — Indian Rupee</option>
                        <option value="USD">🇺🇸 USD — US Dollar</option>
                        <option value="EUR">🇪🇺 EUR — Euro</option>
                        <option value="GBP">🇬🇧 GBP — British Pound</option>
                        <option value="SGD">🇸🇬 SGD — Singapore Dollar</option>
                        <option value="AED">🇦🇪 AED — UAE Dirham</option>
                      </select>
                    </div>
                  </>
                )}

                {section === 'security' && (
                  <>
                    <div style={{ padding: '14px 18px', background: 'var(--accent-gold-dim)', border: '1px solid rgba(240,180,41,0.3)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--accent-gold)', marginBottom: 20 }}>
                      ⚠️ Leave password fields blank if you don't want to change your password.
                    </div>
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input type="password" className="form-input" placeholder="Enter current password"
                        value={form.current_password}
                        onChange={e => setForm(p => ({ ...p, current_password: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input type="password" className="form-input" placeholder="Min 6 characters"
                        value={form.new_password}
                        onChange={e => setForm(p => ({ ...p, new_password: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input type="password" className="form-input" placeholder="Re-enter new password"
                        value={form.confirm_password}
                        onChange={e => setForm(p => ({ ...p, confirm_password: e.target.value }))}
                        style={{ borderColor: form.confirm_password && form.confirm_password !== form.new_password ? 'var(--accent-red)' : '' }} />
                    </div>
                  </>
                )}

                <button type="submit" className="btn btn-primary" disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8 }}>
                  {loading ? 'Saving...' : '💾 Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
