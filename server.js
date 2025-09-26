const express = require("express");
const db = require("./db");
const { recordVmMetrics } = require("./monitor");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 5000;

// Collect every minute
cron.schedule("* * * * *", () => {
  recordVmMetrics();
});

// Latest
app.get("/api/vm/latest", (req, res) => {
  db.get(
    "SELECT * FROM vm_metrics ORDER BY timestamp DESC LIMIT 1",
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    }
  );
});

// History (last 100)
app.get("/api/vm/history", (req, res) => {
  db.all(
    "SELECT * FROM vm_metrics ORDER BY timestamp DESC LIMIT 100",
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.listen(PORT, () => {
  console.log(`VM Monitor API running at http://localhost:${PORT}`);
});
