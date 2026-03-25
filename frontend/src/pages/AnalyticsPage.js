import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { formatCurrency, getCurrentMonthYear, MONTHS, getYearRange } from '../utils/format';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: 10, padding: '12px 16px', fontSize: 13 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 4 }}>
          {p.name}: {typeof p.value === 'number' && p.value > 100 ? formatCurrency(p.value) : p.value}
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { month, year } = getCurrentMonthYear();
  const [selMonth, setSelMonth] = useState(month);
  const [selYear, setSelYear] = useState(year);
  const [dash, setDash] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [d, r] = await Promise.all([
        api.get(`/analytics/dashboard?month=${selMonth}&year=${selYear}`),
        api.get(`/analytics/monthly-report?month=${selMonth}&year=${selYear}`)
      ]);
      setDash(d.data);
      setReport(r.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [selMonth, selYear]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const RADIAN = Math.PI / 180;
  const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>{`${(percent * 100).toFixed(0)}%`}</text>;
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1>Analytics</h1>
            <p>Deep dive into your financial patterns and trends</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <select className="form-input" value={selMonth} onChange={e => setSelMonth(Number(e.target.value))} style={{ width: 140 }}>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select className="form-input" value={selYear} onChange={e => setSelYear(Number(e.target.value))} style={{ width: 100 }}>
              {getYearRange().map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="dashboard-body">
          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : dash && report ? (
            <>
              {/* Summary row */}
              <div className="grid-4 stagger" style={{ marginBottom: 24 }}>
                {[
                  { label: 'Income', val: dash.summary.income, col: 'var(--accent-green)' },
                  { label: 'Expenses', val: dash.summary.expenses, col: 'var(--accent-red)' },
                  { label: 'Savings', val: dash.summary.savings, col: 'var(--accent-gold)' },
                  { label: 'Savings Rate', val: `${dash.summary.savings_rate}%`, col: 'var(--accent-blue)', raw: true },
                ].map((s, i) => (
                  <div key={i} className="card fade-up" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: s.col }}>
                      {s.raw ? s.val : formatCurrency(s.val)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Income vs Expense - area chart */}
              <div className="card" style={{ marginBottom: 24 }}>
                <h3 className="section-title">📈 Income vs Expense Trend (6 Months)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={dash.trend} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
                    <defs>
                      <linearGradient id="aInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="aExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="aSav" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f0b429" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f0b429" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,120,180,0.08)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8fa3c8' }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#8fa3c8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                    <Area type="monotone" dataKey="income" name="Income" stroke="#34d399" fill="url(#aInc)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" fill="url(#aExp)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="savings" name="Savings" stroke="#f0b429" fill="url(#aSav)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Daily spending + category pies */}
              <div className="grid-2" style={{ marginBottom: 24 }}>
                <div className="card">
                  <h3 className="section-title">📆 Daily Spending ({MONTHS[selMonth - 1]})</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={report.daily.filter(d => d.income > 0 || d.expense > 0).slice(-20)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,120,180,0.08)" />
                      <XAxis dataKey="date" tickFormatter={d => d.split('-')[2]} tick={{ fontSize: 10, fill: '#8fa3c8' }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: '#8fa3c8' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="income" name="Income" fill="#34d399" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="expense" name="Expense" fill="#f87171" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <h3 className="section-title">🥧 Expense by Category</h3>
                  {report.expense_by_category.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={report.expense_by_category}
                          cx="50%" cy="50%"
                          outerRadius={80}
                          innerRadius={36}
                          dataKey="total"
                          labelLine={false}
                          label={PieLabel}
                        >
                          {report.expense_by_category.map((entry, i) => (
                            <Cell key={i} fill={entry.color || `hsl(${i * 40}, 60%, 55%)`} />
                          ))}
                        </Pie>
                        <Tooltip formatter={v => formatCurrency(v)} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }}
                          formatter={(v, e) => `${e.payload.icon || ''} ${v}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-state" style={{ padding: 40 }}>
                      <div className="icon">📊</div>
                      <h3>No expense data</h3>
                    </div>
                  )}
                </div>
              </div>

              {/* Category table */}
              {report.expense_by_category.length > 0 && (
                <div className="card">
                  <h3 className="section-title">📋 Category Breakdown</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 16 }}>
                    {report.expense_by_category.map((cat, i) => {
                      const totalExp = report.expense_by_category.reduce((s, c) => s + c.total, 0);
                      const pct = totalExp > 0 ? ((cat.total / totalExp) * 100).toFixed(1) : 0;
                      return (
                        <div key={i} style={{ padding: '14px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span>{cat.icon}</span>
                              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{cat.name}</span>
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{pct}%</span>
                          </div>
                          <div className="progress-bar-wrap">
                            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: cat.color }} />
                          </div>
                          <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)', textAlign: 'right' }}>
                            {formatCurrency(cat.total)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="icon">📊</div>
              <h3>No analytics data</h3>
              <p>Add some transactions to start seeing analytics</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
