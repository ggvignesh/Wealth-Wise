import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Sidebar from '../components/Sidebar';
import TransactionModal from '../components/TransactionModal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatCurrency, formatDate, getCurrentMonthYear, MONTHS, getYearRange } from '../utils/format';

const RADIAN = Math.PI / 180;
const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="#e8edf8" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: 10, padding: '12px 16px', fontSize: 13 }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 4 }}>
          {p.name}: {formatCurrency(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { month, year } = getCurrentMonthYear();
  const [selMonth, setSelMonth] = useState(month);
  const [selYear, setSelYear] = useState(year);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/dashboard?month=${selMonth}&year=${selYear}`);
      setData(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [selMonth, selYear]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const METRIC_CARDS = data ? [
    { label: 'Total Income', value: data.summary.income, color: 'green', icon: '↑' },
    { label: 'Total Expenses', value: data.summary.expenses, color: 'red', icon: '↓' },
    { label: 'Net Savings', value: data.summary.savings, color: data.summary.savings >= 0 ? 'green' : 'red', icon: '💰' },
    { label: 'Savings Rate', value: `${data.summary.savings_rate}%`, color: 'gold', icon: '%', raw: true },
  ] : [];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]} 👋</h1>
            <p>Here's your financial snapshot for {MONTHS[selMonth - 1]} {selYear}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="form-input"
              value={selMonth}
              onChange={e => setSelMonth(Number(e.target.value))}
              style={{ width: 140 }}
            >
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select
              className="form-input"
              value={selYear}
              onChange={e => setSelYear(Number(e.target.value))}
              style={{ width: 100 }}
            >
              {getYearRange().map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Add Transaction
            </button>
          </div>
        </div>

        <div className="dashboard-body">
          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : data ? (
            <>
              {/* Budget Alerts */}
              {data.budget_alerts?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  {data.budget_alerts.map((alert, i) => (
                    <div key={i} className={`alert-strip ${alert.exceeded ? 'danger' : 'warning'}`}>
                      <span style={{ fontSize: 20 }}>{alert.exceeded ? '🚨' : '⚠️'}</span>
                      <div>
                        <strong>{alert.budget.category?.name || 'Budget'}</strong>
                        {' '}{alert.exceeded ? 'exceeded!' : 'at'} {alert.percentage}% —{' '}
                        Spent {formatCurrency(alert.spent)} of {formatCurrency(alert.budget.amount)}
                      </div>
                      <Link to="/budgets" style={{ marginLeft: 'auto', fontSize: 12, color: 'inherit', textDecoration: 'underline', whiteSpace: 'nowrap' }}>
                        Manage →
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary Metrics */}
              <div className="grid-4 stagger" style={{ marginBottom: 24 }}>
                {METRIC_CARDS.map((m, i) => (
                  <div key={i} className={`metric-card ${m.color} fade-up`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div className="metric-label">{m.label}</div>
                      <div style={{ fontSize: 20, opacity: 0.6 }}>{m.icon}</div>
                    </div>
                    <div className={`metric-value ${m.color}`}>
                      {m.raw ? m.value : formatCurrency(m.value)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid-2" style={{ marginBottom: 24 }}>
                {/* 6-month trend */}
                <div className="card">
                  <h3 className="section-title">📈 6-Month Trend</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={data.trend}>
                      <defs>
                        <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34d399" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f87171" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,120,180,0.08)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8fa3c8' }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#8fa3c8' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="income" name="Income" stroke="#34d399" fill="url(#incGrad)" strokeWidth={2} dot={false} />
                      <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" fill="url(#expGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Category breakdown pie */}
                <div className="card">
                  <h3 className="section-title">🍕 Expense Breakdown</h3>
                  {data.category_breakdown.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={data.category_breakdown}
                          cx="50%" cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          dataKey="total"
                          labelLine={false}
                          label={CustomPieLabel}
                        >
                          {data.category_breakdown.map((entry, i) => (
                            <Cell key={i} fill={entry.color || `hsl(${i * 37}, 60%, 55%)`} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => formatCurrency(v)} />
                        <Legend
                          formatter={(value, entry) => `${entry.payload.icon || ''} ${value}`}
                          iconType="circle"
                          wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-state" style={{ padding: 40 }}>
                      <div className="icon">📊</div>
                      <h3>No expenses yet</h3>
                      <p>Add transactions to see category breakdown</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Savings bar chart + recent transactions */}
              <div className="grid-2">
                <div className="card">
                  <h3 className="section-title">💰 Monthly Savings</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,120,180,0.08)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8fa3c8' }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#8fa3c8' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="savings" name="Savings" fill="#f0b429" radius={[4, 4, 0, 0]}>
                        {data.trend.map((entry, i) => (
                          <Cell key={i} fill={entry.savings >= 0 ? '#f0b429' : '#f87171'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Recent Transactions */}
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 className="section-title" style={{ margin: 0 }}>🕐 Recent Activity</h3>
                    <Link to="/transactions" style={{ fontSize: 13, color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
                  </div>
                  {data.recent_transactions.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {data.recent_transactions.map(txn => (
                        <div key={txn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 36, height: 36,
                              background: txn.type === 'income' ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
                              border: `1px solid ${txn.type === 'income' ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                              borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 16, flexShrink: 0
                            }}>
                              {txn.category?.icon || (txn.type === 'income' ? '↑' : '↓')}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                                {txn.description || txn.category?.name || 'Transaction'}
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(txn.date)}</div>
                            </div>
                          </div>
                          <div style={{
                            fontSize: 14, fontWeight: 700,
                            color: txn.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)'
                          }}>
                            {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state" style={{ padding: 30 }}>
                      <div className="icon">📝</div>
                      <h3>No transactions</h3>
                      <p>Start tracking your money!</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="icon">❌</div>
              <h3>Failed to load dashboard</h3>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSaved={fetchDashboard}
        />
      )}
    </div>
  );
}
