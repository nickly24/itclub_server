const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Маршрут для получения всех расписаний
router.get('/', (req, res) => {
  const sql = `
    SELECT schedules.id, schedules.day_of_week, schedules.time, schedules.filial_id, schedules.prepod,
           filials.name, filials.address, filials.metro, filials.metro_color, filials.price, filials.tel, filials.comment
    FROM schedules
    JOIN filials ON schedules.filial_id = filials.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching schedules:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});


// Маршрут для обновления расписания
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { day_of_week, time } = req.body;
  const sql = 'UPDATE schedules SET day_of_week = ?, time = ? WHERE id = ?';

  db.query(sql, [day_of_week, time, id], (err, result) => {
    if (err) {
      console.error('Error updating schedule:', err);
      res.status(500).send('Server error');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('Schedule not found');
      return;
    }

    res.json({ id, day_of_week, time });
  });
});


// Маршрут для добавления нового расписания
router.post('/', (req, res) => {
  const { day_of_week, time, filial_id } = req.body;
  const sql = 'INSERT INTO schedules (day_of_week, time, filial_id) VALUES (?, ?, ?)';
  db.query(sql, [day_of_week, time, filial_id], (err, result) => {
    if (err) {
      console.error('Error adding schedule:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json({ id: result.insertId, ...req.body });
  });
});


// Маршрут для удаления расписания
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM schedules WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting schedule:', err);
      res.status(500).send('Server error');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('Schedule not found');
      return;
    }

    res.json({ id });
  });
});


module.exports = router;
