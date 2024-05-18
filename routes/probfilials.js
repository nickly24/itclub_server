const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Маршрут для получения всех пробных занятий
router.get('/', (req, res) => {
  db.query('SELECT * FROM probfilials', (err, results) => {
    if (err) {
      console.error('Error fetching probfilials:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// Маршрут для добавления нового пробного занятия
router.post('/', (req, res) => {
  const { name, address, metro, color, price, trialDate, dayOfWeek, time } = req.body;

  console.log('Request body:', req.body); // Логирование тела запроса

  const sql = 'INSERT INTO probfilials (name, address, metro, color, price, trialDate, dayOfWeek, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, address, metro, color, price, trialDate, dayOfWeek, time], (err, result) => {
    if (err) {
      console.error('Error adding trial filial:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json({ id: result.insertId, ...req.body });
  });
});

// Маршрут для удаления пробного занятия
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM probfilials WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting probfilial:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json({ success: true });
  });
});

// Маршрут для редактирования пробного занятия
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, address, metro, color, price, trialDate, dayOfWeek, time } = req.body;
  const sql = 'UPDATE probfilials SET name = ?, address = ?, metro = ?, color = ?, price = ?, trialDate = ?, dayOfWeek = ?, time = ? WHERE id = ?';
  
  db.query(sql, [name, address, metro, color, price, trialDate, dayOfWeek, time, id], (err, result) => {
    if (err) {
      console.error('Error updating probfilial:', err);  // Логирование ошибки
      res.status(500).send('Server error');
      return;
    }
    res.json({ success: true });
  });
});

module.exports = router;
