const mysql = require('mysql2');

const db = mysql.createConnection({
  port: "3306",
  user: "gen_user",
  host: "147.45.138.77",
  database: "default_db",
  password: ":xgSD;^N3qZ\\ir" // Escaped backslash
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.code, err.sqlMessage);
    return;
  }
  console.log('Connected to the database');
});

module.exports = db;
