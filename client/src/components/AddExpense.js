import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AddExpense() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = ['Food', 'Transport', 'Entertainment', 'Other'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/expenses', formData);
      setSuccess('Expense added successfully!');
      
      // Reset form
      setFormData({
        amount: '',
        description: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense');
    }
  };

  return (
    <div className="add-expense-container">
      <h2>Add New Expense</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount ($)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength="255"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Add Expense
        </button>
        
        <button 
          type="button" 
          onClick={() => navigate('/dashboard')}
          className="btn-secondary"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
