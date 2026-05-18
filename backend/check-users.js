const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

db.all('SELECT * FROM users', (err, rows) => {
  console.table(rows);
  db.close();
});
