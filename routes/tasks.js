const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, description, priority, due_date } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO tasks (user_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, description, priority, due_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Task created!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { title, description, priority, status, due_date } = req.body;
  try {
    await db.query(
      'UPDATE tasks SET title=?, description=?, priority=?, status=?, due_date=? WHERE id=? AND user_id=?',
      [title, description, priority, status, due_date, req.params.id, req.user.id]
    );
    res.json({ message: 'Task updated!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM tasks WHERE id=? AND user_id=?',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Task deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  try {
    await db.query(
      'UPDATE tasks SET status=? WHERE id=? AND user_id=?',
      [status, req.params.id, req.user.id]
    );
    res.json({ message: 'Status updated!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;