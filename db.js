const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./vm_metrics.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS vm_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      cpu_usage REAL,
      load1 REAL,
      load5 REAL,
      load15 REAL,
      memory_usage REAL
    )
  `);
});

module.exports = db;
