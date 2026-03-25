import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
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
          {p.name}: {formatCurrency(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function ReportsPage() {
  const { month, year } = getCurrentMonthYear();
  const [selMonth, setSelMonth] = useState(month);
  const [selYear, setSelYear] = useState(year);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/monthly-report?month=${selMonth}&year=${selYear}`);
      setReport(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [selMonth, selYear]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const totalIncome = report?.income_by_category.reduce((s, c) => s + c.total, 0) || 0;
  const totalExpense = report?.expense_by_category.reduce((s, c) => s + c.total, 0) || 0;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1>Monthly Report</h1>
            <p>Complete breakdown of your financial activity</p>
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
          ) : report ? (
            <>
              {/* Report header */}
              <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(240,180,41,0.04) 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
                      {report.month_name} {report.year}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Financial Summary Report</p>
                  </div>
                  <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Income</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-green)' }}>{formatCurrency(totalIncome)}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Expenses</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-red)' }}>{formatCurrency(totalExpense)}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Savings</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: totalIncome - totalExpense >= 0 ? 'var(--accent-gold)' : 'var(--accent-red)' }}>
                        {formatCurrency(totalIncome - totalExpense)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Savings Rate</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-blue)' }}>
                        {totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily chart */}
              <div className="card" style={{ marginBottom: 24 }}>
                <h3 className="section-title">📆 Daily Income & Expenses</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={report.daily.filter(d => d.income > 0 || d.expense > 0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,120,180,0.08)" />
                    <XAxis dataKey="date" tickFormatter={d => `${parseInt(d.split('-')[2])}`} tick={{ fontSize: 10, fill: '#8fa3c8' }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#8fa3c8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="income" name="Income" fill="#34d399" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#f87171" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Income & expense by category side by side */}
              <div className="grid-2" style={{ marginBottom: 24 }}>
                {/* Income */}
                <div className="card">
                  <h3 className="section-title" style={{ color: 'var(--accent-green)' }}>↑ Income Sources</h3>
                  {report.income_by_category.length > 0 ? (
                    <>
                      {report.income_by_category.map((cat, i) => (
                        <div key={i} style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>{cat.icon}</span>
                              <span style={{ fontWeight: 500 }}>{cat.name}</span>
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-green)' }}>
                              {formatCurrency(cat.total)}
                            </span>
                          </div>
                          <div className="progress-bar-wrap">
                            <div className="progress-bar-fill" style={{
                              width: `${totalIncome > 0 ? (cat.total / totalIncome * 100) : 0}%`,
                              background: cat.color || '#34d399'
                            }} />
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Total Income</span>
                        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent-green)' }}>{formatCurrency(totalIncome)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="empty-state" style={{ padding: 30 }}>
                      <div className="icon">💰</div>
                      <h3>No income recorded</h3>
                    </div>
                  )}
                </div>

                {/* Expenses */}
                <div className="card">
                  <h3 className="section-title" style={{ color: 'var(--accent-red)' }}>↓ Expense Breakdown</h3>
                  {report.expense_by_category.length > 0 ? (
                    <>
                      {report.expense_by_category.map((cat, i) => (
                        <div key={i} style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>{cat.icon}</span>
                              <span style={{ fontWeight: 500 }}>{cat.name}</span>
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-red)' }}>
                              {formatCurrency(cat.total)}
                            </span>
                          </div>
                          <div className="progress-bar-wrap">
                            <div className="progress-bar-fill" style={{
                              width: `${totalExpense > 0 ? (cat.total / totalExpense * 100) : 0}%`,
                              background: cat.color || '#f87171'
                            }} />
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Total Expenses</span>
                        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent-red)' }}>{formatCurrency(totalExpense)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="empty-state" style={{ padding: 30 }}>
                      <div className="icon">🛍️</div>
                      <h3>No expenses recorded</h3>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state card">
              <div className="icon">📊</div>
              <h3>No report data</h3>
              <p>Add transactions to generate a monthly report</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
