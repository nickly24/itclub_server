const mysql = require('mysql2');
const fs = require('fs');

// Функция для логирования
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  fs.appendFile('database.log', logMessage, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
};

const db = mysql.createPool({
  port: "3306",
  user: "gen_user",
  host: "147.45.138.77",
  database: "default_db",
  password: ":xgSD;^N3qZ\\ir",
  waitForConnections: true,
  connectionLimit: 10, // Установите максимальное количество соединений в пуле
  queueLimit: 0 // Нет ограничений на количество запросов в очереди
});

// Логирование успешного подключения
db.getConnection((err, connection) => {
  if (err) {
    log(`Error connecting to the database: ${err.code} - ${err.message}`);
  } else {
    log('Connected to the database');
    connection.release(); // Освобождаем соединение обратно в пул
  }
});

// Обертка для логирования запросов
const queryWithLogging = (sql, params, callback) => {
  log(`Executing query: ${sql}`);
  db.query(sql, params, (err, results) => {
    if (err) {
      log(`Query error: ${err.code} - ${err.message}`);
    } else {
      log(`Query successful: ${sql}`);
    }
    callback(err, results);
  });
};

// Обертка для логирования запросов без параметров
const queryWithoutParamsWithLogging = (sql, callback) => {
  log(`Executing query: ${sql}`);
  db.query(sql, (err, results) => {
    if (err) {
      log(`Query error: ${err.code} - ${err.message}`);
    } else {
      log(`Query successful: ${sql}`);
    }
    callback(err, results);
  });
};

// Экспортируем функции для использования в роутерах
module.exports = {
  query: queryWithLogging,
  queryWithoutParams: queryWithoutParamsWithLogging
};
