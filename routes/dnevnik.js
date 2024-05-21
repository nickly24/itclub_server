const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/dnevnik/:year/:month', (req, res) => {
  const { year, month } = req.params;
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;

  const sql = `
      SELECT a.id, f.name AS filial_name, a.date, a.number_of_children, a.price_per_session,
      p.Name AS prepod_name, p.color, p.reg_string
      FROM dnevnik a
      JOIN filials f ON a.filial_id = f.id
      JOIN prepods p ON a.prepod_id = p.id
      WHERE a.date BETWEEN ? AND ?
      ORDER BY f.name, a.date;
  `;

  db.query(sql, [startDate, endDate], (err, results) => {
    if (err) {
      console.error('Error fetching attendance:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});


// Маршрут для добавления записи о посещаемости
router.post('/dnevnik', (req, res) => {
  const { filial_id, date, number_of_children, price_per_session } = req.body;
  const sql = 'INSERT INTO dnevnik (filial_id, date, number_of_children, price_per_session) VALUES (?, ?, ?, ?)';
  
  db.query(sql, [filial_id, date, number_of_children, price_per_session], (err, result) => {
    if (err) {
      console.error('Error adding dnevnik:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json({ id: result.insertId, ...req.body });
  });
});

// Маршрут для обновления записи о посещаемости
router.put('/dnevnik/:id', (req, res) => {
  const { id } = req.params;
  const { filial_id, date, number_of_children, price_per_session } = req.body;
  const sql = 'UPDATE dnevnik SET filial_id = ?, date = ?, number_of_children = ?, price_per_session = ? WHERE id = ?';

  db.query(sql, [filial_id, date, number_of_children, price_per_session, id], (err, result) => {
    if (err) {
      console.error('Error updating dnevnik:', err);
      res.status(500).send('Server error');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('dnevnik record not found');
      return;
    }
    res.sendStatus(200); // OK
  });
});

// Маршрут для удаления записи о посещаемости
router.delete('/dnevnik/:id', (req, res) => {
  const { id } = req.params;
  console.log('Deleting record with ID:', id); // Логирование идентификатора
  const sql = 'DELETE FROM dnevnik WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting dnevnik:', err);
      res.status(500).send('Server error');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('dnevnik record not found');
      return;
    }
    res.sendStatus(204); // No Content
  });
});

module.exports = router;
