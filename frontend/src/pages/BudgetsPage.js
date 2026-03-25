import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { formatCurrency, getCurrentMonthYear, MONTHS, getYearRange } from '../utils/format';
import toast from 'react-hot-toast';

function BudgetModal({ onClose, onSaved }) {
  const { month, year } = getCurrentMonthYear();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category_id: '', amount: '', month, year, alert_threshold: 80 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories/?type=expense').then(r => setCategories(r.data.categories));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) return toast.error('Enter a valid amount');
    setLoading(true);
    try {
      await api.post('/budgets/', { ...form, category_id: form.category_id || null });
      toast.success('Budget set!');
      onSaved();
      onClose();
    } catch { toast.error('Failed to set budget'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Set Budget</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}>
              <option value="">Overall Budget</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Budget Amount (₹)</label>
            <input type="number" className="form-input" placeholder="0.00" value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} min="1" required
              style={{ fontSize: 20, fontWeight: 700 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Month</label>
              <select className="form-input" value={form.month} onChange={e => setForm(p => ({ ...p, month: Number(e.target.value) }))}>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Year</label>
              <select className="form-input" value={form.year} onChange={e => setForm(p => ({ ...p, year: Number(e.target.value) }))}>
                {getYearRange().map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Alert at {form.alert_threshold}% spent</label>
            <input type="range" min="50" max="100" value={form.alert_threshold}
              onChange={e => setForm(p => ({ ...p, alert_threshold: Number(e.target.value) }))}
              style={{ width: '100%', accentColor: 'var(--accent-gold)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              <span>50%</span><span>75%</span><span>100%</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Saving...' : 'Set Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BudgetsPage() {
  const { month, year } = getCurrentMonthYear();
  const [selMonth, setSelMonth] = useState(month);
  const [selYear, setSelYear] = useState(year);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/budgets/?month=${selMonth}&year=${selYear}`);
      setBudgets(res.data.budgets);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [selMonth, selYear]);

  useEffect(() => { fetchBudgets(); }, [fetchBudgets]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    await api.delete(`/budgets/${id}`);
    toast.success('Budget removed');
    fetchBudgets();
  };

  const getStatus = (pct) => {
    if (pct >= 100) return { color: 'var(--accent-red)', bg: 'var(--accent-red-dim)', label: 'Exceeded', emoji: '🚨' };
    if (pct >= 80) return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Warning', emoji: '⚠️' };
    return { color: 'var(--accent-green)', bg: 'var(--accent-green-dim)', label: 'On Track', emoji: '✅' };
  };

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1>Budgets</h1>
            <p>Set spending limits and get alerted before overspending</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <select className="form-input" value={selMonth} onChange={e => setSelMonth(Number(e.target.value))} style={{ width: 140 }}>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select className="form-input" value={selYear} onChange={e => setSelYear(Number(e.target.value))} style={{ width: 100 }}>
              {getYearRange().map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Set Budget</button>
          </div>
        </div>

        <div className="dashboard-body">
          {/* Summary */}
          {budgets.length > 0 && (
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Total Budgeted</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--accent-gold)' }}>{formatCurrency(totalBudget)}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Total Spent</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: totalSpent > totalBudget ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                    {formatCurrency(totalSpent)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Remaining</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--accent-blue)' }}>
                    {formatCurrency(Math.max(0, totalBudget - totalSpent))}
                  </div>
                </div>
                <div style={{ flex: '0 0 280px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>Overall</span>
                    <span>{totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <div className="progress-bar-wrap" style={{ height: 10 }}>
                    <div className="progress-bar-fill" style={{
                      width: `${Math.min(100, totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0)}%`,
                      background: totalSpent > totalBudget ? 'var(--accent-red)' : 'var(--accent-gold)'
                    }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : budgets.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: 20 }}>
              {budgets.map(b => {
                const status = getStatus(b.percentage);
                return (
                  <div key={b.id} className="card" style={{ border: `1px solid ${b.percentage >= 100 ? 'rgba(248,113,113,0.3)' : b.percentage >= 80 ? 'rgba(245,158,11,0.3)' : 'var(--border)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ fontSize: 24 }}>{b.category?.icon || '📦'}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{b.category?.name || 'Overall Budget'}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Alert at {b.alert_threshold}%</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 100, background: status.bg, color: status.color }}>
                          {status.emoji} {status.label}
                        </span>
                        <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => handleDelete(b.id)}>✕</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Spent</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: status.color }}>{formatCurrency(b.spent)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Budget</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{formatCurrency(b.amount)}</div>
                      </div>
                    </div>

                    <div className="progress-bar-wrap" style={{ height: 10, marginBottom: 8 }}>
                      <div className="progress-bar-fill" style={{
                        width: `${Math.min(100, b.percentage)}%`,
                        background: status.color
                      }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'var(--text-muted)' }}>{b.percentage}% used</span>
                      <span style={{ color: b.remaining >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
                        {b.remaining >= 0 ? `${formatCurrency(b.remaining)} left` : `${formatCurrency(Math.abs(b.remaining))} over`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state card">
              <div className="icon">🎯</div>
              <h3>No budgets set</h3>
              <p>Set spending limits to keep your expenses in check</p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
                + Set First Budget
              </button>
            </div>
          )}
        </div>
      </main>

      {showModal && <BudgetModal onClose={() => setShowModal(false)} onSaved={fetchBudgets} />}
    </div>
  );
}
