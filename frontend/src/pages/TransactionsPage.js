import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import TransactionModal from '../components/TransactionModal';
import api from '../utils/api';
import { formatCurrency, formatDate, getCurrentMonthYear, MONTHS, getYearRange } from '../utils/format';
import toast from 'react-hot-toast';

export default function TransactionsPage() {
  const { month, year } = getCurrentMonthYear();
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filters, setFilters] = useState({ type: '', month: '', year: '', search: '' });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories/').then(r => setCategories(r.data.categories));
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, per_page: 15, ...filters });
    try {
      const res = await api.get(`/transactions/?${params}`);
      setTransactions(res.data.transactions);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    await api.delete(`/transactions/${id}`);
    toast.success('Transaction deleted');
    fetchTransactions();
  };

  const handleEdit = (txn) => {
    setEditData(txn);
    setShowModal(true);
  };

  const PAYMENT_ICONS = { cash: '💵', upi: '📱', card: '💳', netbanking: '🏦', cheque: '📄', other: '•' };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1>Transactions</h1>
            <p>{total} total entries — track every rupee in and out</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditData(null); setShowModal(true); }}>
            + Add Transaction
          </button>
        </div>

        <div className="dashboard-body">
          {/* Filters */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 14 }}>
              <div>
                <label className="form-label">Search</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search description..."
                  value={filters.search}
                  onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Type</label>
                <select className="form-input" value={filters.type}
                  onChange={e => setFilters(p => ({ ...p, type: e.target.value }))}>
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="form-label">Month</label>
                <select className="form-input" value={filters.month}
                  onChange={e => setFilters(p => ({ ...p, month: e.target.value }))}>
                  <option value="">All Months</option>
                  {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Year</label>
                <select className="form-input" value={filters.year}
                  onChange={e => setFilters(p => ({ ...p, year: e.target.value }))}>
                  <option value="">All Years</option>
                  {getYearRange().map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }}
                  onClick={() => { setFilters({ type: '', month: '', year: '', search: '' }); setPage(1); }}>
                  Clear
                </button>
                <button className="btn btn-primary" style={{ flex: 1 }}
                  onClick={() => { setPage(1); fetchTransactions(); }}>
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card">
            {loading ? (
              <div className="loader"><div className="spinner" /></div>
            ) : transactions.length > 0 ? (
              <>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Payment</th>
                        <th>Type</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(txn => (
                        <tr key={txn.id}>
                          <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatDate(txn.date)}</td>
                          <td>
                            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                              {txn.description || '—'}
                            </div>
                            {txn.notes && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{txn.notes}</div>}
                          </td>
                          <td>
                            {txn.category ? (
                              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>{txn.category.icon}</span>
                                <span style={{ fontSize: 13 }}>{txn.category.name}</span>
                              </span>
                            ) : <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>—</span>}
                          </td>
                          <td>
                            <span style={{ fontSize: 13 }}>{PAYMENT_ICONS[txn.payment_method] || '•'} {txn.payment_method}</span>
                          </td>
                          <td>
                            <span className={`badge ${txn.type === 'income' ? 'badge-green' : 'badge-red'}`}>
                              {txn.type === 'income' ? '↑' : '↓'} {txn.type}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            <span style={{ color: txn.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                              {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                              <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleEdit(txn)}>Edit</button>
                              <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleDelete(txn.id)}>Del</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                    <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span style={{ padding: '8px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
                      Page {page} of {pages}
                    </span>
                    <button className="btn btn-secondary" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next →</button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <div className="icon">📋</div>
                <h3>No transactions found</h3>
                <p>Try adjusting your filters or add a new transaction</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
                  + Add First Transaction
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <TransactionModal
          onClose={() => { setShowModal(false); setEditData(null); }}
          onSaved={fetchTransactions}
          transaction={editData}
        />
      )}
    </div>
  );
}
