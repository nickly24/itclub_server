const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Маршрут для получения всех филиалов
router.get('/', (req, res) => {
  db.query('SELECT * FROM filials', (err, results) => {
    if (err) {
      console.error('Error fetching filials:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// Маршрут для добавления нового филиала
router.post('/', (req, res) => {
  const { name, address, metro, metro_color, price, tel, comment } = req.body;
  const sql = 'INSERT INTO filials (name, address, metro, metro_color, price, tel, comment) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, address, metro, metro_color, price, tel, comment], (err, result) => {
    if (err) {
      console.error('Error adding filial:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json({ id: result.insertId, ...req.body });
  });
});

// Маршрут для удаления филиала
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM filials WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting filial:', err);
      res.status(500).send('Server error');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Filial not found');
      return;
    }
    res.sendStatus(204); // No Content
  });
});

// Маршрут для обновления филиала
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, address, metro, metro_color, price, tel, comment } = req.body;
  const sql = 'UPDATE filials SET name = ?, address = ?, metro = ?, metro_color = ?, price = ?, tel = ?, comment = ? WHERE id = ?';
  db.query(sql, [name, address, metro, metro_color, price, tel, comment, id], (err, result) => {
    if (err) {
      console.error('Error updating filial:', err);
      res.status(500).send('Server error');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Filial not found');
      return;
    }
    res.sendStatus(200); // OK
  });
});

module.exports = router;
