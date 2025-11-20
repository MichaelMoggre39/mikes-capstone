import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const [summary, setSummary] = useState({
    monthlyTotal: 0,
    categoryBreakdown: [],
    recentExpenses: []
  });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [summaryRes, expensesRes] = await Promise.all([
        api.get('/expenses/summary'),
        api.get('/expenses')
      ]);
      setSummary(summaryRes.data);
      setExpenses(expensesRes.data.expenses);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await api.delete(`/expenses/${id}`);
      loadData(); // Reload data after deletion
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <Link to="/add" className="btn-add">+ Add Expense</Link>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>This Month</h3>
          <div className="amount">${summary.monthlyTotal.toFixed(2)}</div>
        </div>
        
        <div className="card">
          <h3>Total Expenses</h3>
          <div className="amount">{expenses.length}</div>
        </div>
      </div>

      {/* Category Breakdown */}
      {summary.categoryBreakdown.length > 0 && (
        <div className="expenses-section" style={{ marginBottom: '2rem' }}>
          <h3>By Category</h3>
          <ul className="category-list">
            {summary.categoryBreakdown.map((cat) => (
              <li key={cat.category} className="category-item">
                <span>
                  <span className={`expense-category category-${cat.category}`}>
                    {cat.category}
                  </span>
                  <span style={{ marginLeft: '1rem' }}>{cat.count} expenses</span>
                </span>
                <strong>${cat.total.toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Expenses */}
      <div className="expenses-section">
        <h3>Recent Expenses</h3>
        {summary.recentExpenses.length === 0 ? (
          <div className="no-expenses">
            <p>No expenses yet. Add your first expense!</p>
          </div>
        ) : (
          <ul className="expenses-list">
            {summary.recentExpenses.map((expense) => (
              <li key={expense.id} className="expense-item">
                <div className="expense-details">
                  <div className="expense-description">
                    {expense.description}
                    <span className={`expense-category category-${expense.category}`}>
                      {expense.category}
                    </span>
                  </div>
                  <div className="expense-meta">
                    {formatDate(expense.date)}
                  </div>
                </div>
                <div className="expense-amount">${parseFloat(expense.amount).toFixed(2)}</div>
                <button 
                  onClick={() => handleDelete(expense.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* All Expenses */}
      {expenses.length > 5 && (
        <div className="expenses-section" style={{ marginTop: '2rem' }}>
          <h3>All Expenses</h3>
          <ul className="expenses-list">
            {expenses.map((expense) => (
              <li key={expense.id} className="expense-item">
                <div className="expense-details">
                  <div className="expense-description">
                    {expense.description}
                    <span className={`expense-category category-${expense.category}`}>
                      {expense.category}
                    </span>
                  </div>
                  <div className="expense-meta">
                    {formatDate(expense.date)}
                  </div>
                </div>
                <div className="expense-amount">${parseFloat(expense.amount).toFixed(2)}</div>
                <button 
                  onClick={() => handleDelete(expense.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
