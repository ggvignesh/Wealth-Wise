import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function TransactionModal({ onClose, onSaved, transaction = null }) {
  const editData = transaction;
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    type: editData?.type || 'expense',
    amount: editData?.amount || '',
    description: editData?.description || '',
    category_id: editData?.category_id || '',
    date: editData?.date || new Date().toISOString().split('T')[0],
    notes: editData?.notes || '',
    payment_method: editData?.payment_method || 'cash'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/categories/?type=${form.type}`)
      .then(res => setCategories(res.data.categories))
      .catch(() => setCategories([]));
  }, [form.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category_id: '' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      return toast.error('Enter a valid amount');
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        category_id: form.category_id ? parseInt(form.category_id) : null,
      };
      if (editData) {
        await api.put(`/transactions/${editData.id}`, payload);
        toast.success('Transaction updated!');
      } else {
        await api.post('/transactions/', payload);
        toast.success('Transaction added!');
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{editData ? 'Edit' : 'Add'} Transaction</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Type toggle */}
        <div className="type-toggle" style={{ marginBottom: 20 }}>
          <button
            type="button"
            className={form.type === 'income' ? 'active-income' : ''}
            onClick={() => setForm(p => ({ ...p, type: 'income', category_id: '' }))}
          >
            ↑ Income
          </button>
          <button
            type="button"
            className={form.type === 'expense' ? 'active-expense' : ''}
            onClick={() => setForm(p => ({ ...p, type: 'expense', category_id: '' }))}
          >
            ↓ Expense
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              className="form-input"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              required
              style={{ fontSize: 22, fontWeight: 700 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              name="description"
              type="text"
              className="form-input"
              placeholder="What was this for?"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category_id" className="form-input" value={form.category_id} onChange={handleChange}>
                <option value="">No category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                name="date"
                type="date"
                className="form-input"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select name="payment_method" className="form-input" value={form.payment_method} onChange={handleChange}>
                <option value="cash">💵 Cash</option>
                <option value="upi">📱 UPI</option>
                <option value="card">💳 Card</option>
                <option value="netbanking">🏦 Net Banking</option>
                <option value="cheque">📄 Cheque</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <input
                name="notes"
                type="text"
                className="form-input"
                placeholder="Optional notes"
                value={form.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? '⏳ Saving...' : editData ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
