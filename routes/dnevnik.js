const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { format, lastDayOfMonth } = require('date-fns');




router.get('/analytics/:year/:month/:filialId', (req, res) => {
  const { year, month, filialId } = req.params;
  const startDate = `${year}-${month}-01`;
  const endDate = format(lastDayOfMonth(new Date(year, month - 1)), 'yyyy-MM-dd');

  const sql = `
      SELECT a.id, f.name AS filial_name, a.date, a.number_of_children, a.price_per_session,
      p.Name AS prepod_name, p.color, p.reg_string
      FROM dnevnik a
      JOIN filials f ON a.filial_id = f.id
      JOIN prepods p ON a.prepod_id = p.id
      WHERE a.date BETWEEN ? AND ? AND a.filial_id = ?
      ORDER BY f.name, a.date;
  `;

  console.log(`Executing SQL for ${year}-${month} and filialId ${filialId}: ${sql} with params [${startDate}, ${endDate}, ${filialId}]`);

  db.query(sql, [startDate, endDate, filialId], (err, results) => {
    if (err) {
      console.error('Error fetching attendance:', err);
      res.status(500).send('Server error');
      return;
    }
    console.log(`Results for ${year}-${month} and filialId ${filialId}:`, results);
    res.json(results);
  });
});



router.get('/dnevnik/:year/:month', (req, res) => {
  const { year, month } = req.params;
  const startDate = `${year}-${month}-01`;
  const endDate = format(lastDayOfMonth(new Date(year, month - 1)), 'yyyy-MM-dd');

  const sql = `
      SELECT a.id, f.name AS filial_name, a.date, a.number_of_children, a.price_per_session,
      p.Name AS prepod_name, p.color, p.reg_string
      FROM dnevnik a
      JOIN filials f ON a.filial_id = f.id
      JOIN prepods p ON a.prepod_id = p.id
      WHERE a.date BETWEEN ? AND ?
      ORDER BY f.name, a.date;
  `;

  console.log(`Executing SQL for ${year}-${month}: ${sql} with params [${startDate}, ${endDate}]`);

  db.query(sql, [startDate, endDate], (err, results) => {
    if (err) {
      console.error('Error fetching attendance:', err);
      res.status(500).send('Server error');
      return;
    }
    console.log(`Results for ${year}-${month}:`, results);
    res.json(results);
  });
});


// Маршрут для добавления записи о посещаемости
router.post('/dnevnik', (req, res) => {
  const { filial_id, date, number_of_children, price_per_session, prepod_id } = req.body;
  if (!prepod_id) {
    res.status(400).send('prepod_id is required');
    return;
  }
  const sql = 'INSERT INTO dnevnik (filial_id, date, number_of_children, price_per_session, prepod_id) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [filial_id, date, number_of_children, price_per_session, prepod_id], (err, result) => {
    if (err) {
      console.error('Error adding dnevnik:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json({ id: result.insertId, ...req.body });
  });
});



// Маршрут для получения списка преподавателей
router.get('/prepods', (req, res) => {
  const sql = 'SELECT id, name FROM prepods';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching prepods:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});


// Маршрут для обновления записи о посещаемости
router.put('/dnevnik/:id', (req, res) => {
  const { id } = req.params;
  const { filial_id, date, number_of_children, price_per_session,prepod_id } = req.body;
  const sql = 'UPDATE dnevnik SET filial_id = ?, date = ?, number_of_children = ?, price_per_session = ?, prepod_id = ? WHERE id = ?';

  db.query(sql, [filial_id, date, number_of_children, price_per_session, prepod_id, id], (err, result) => {
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
