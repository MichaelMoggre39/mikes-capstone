const express = require('express');
const db = require('../database/db');

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get all expenses for logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
      [req.session.userId]
    );
    res.json({ expenses: result.rows });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get expense summary (monthly total and category breakdown)
router.get('/summary', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    
    // Get current month's total
    const monthlyResult = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM expenses 
       WHERE user_id = $1 
       AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
       AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)`,
      [userId]
    );

    // Get category breakdown
    const categoryResult = await db.query(
      `SELECT category, COUNT(*) as count, COALESCE(SUM(amount), 0) as total
       FROM expenses 
       WHERE user_id = $1
       GROUP BY category`,
      [userId]
    );

    // Get recent expenses
    const recentResult = await db.query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC, created_at DESC LIMIT 5',
      [userId]
    );

    res.json({
      monthlyTotal: parseFloat(monthlyResult.rows[0].total),
      categoryBreakdown: categoryResult.rows.map(row => ({
        category: row.category,
        count: parseInt(row.count),
        total: parseFloat(row.total)
      })),
      recentExpenses: recentResult.rows
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new expense
router.post('/', requireAuth, async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;

    // Validation
    if (!amount || !description || !category || !date) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const validCategories = ['Food', 'Transport', 'Entertainment', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const result = await db.query(
      'INSERT INTO expenses (user_id, amount, description, category, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.session.userId, amount, description, category, date]
    );

    res.status(201).json({ 
      message: 'Expense added successfully',
      expense: result.rows[0]
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if expense exists and belongs to user
    const checkResult = await db.query(
      'SELECT * FROM expenses WHERE id = $1 AND user_id = $2',
      [id, req.session.userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await db.query('DELETE FROM expenses WHERE id = $1', [id]);

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
