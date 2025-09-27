const express = require("express");
const cors = require("cors");
const db = require("./db");
const { recordVmMetrics } = require("./monitor");
const { startDashboard } = require("./dashboard");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS for localhost:3000 and blindfold.cloud
app.use(
  cors({
    origin: ["http://localhost:3000", "https://blindfold.cloud"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Collect every minute into DB
cron.schedule("* * * * *", () => {
  recordVmMetrics();
});

// Start live console dashboard (updates every 2s)
startDashboard(2000);

// API routes
app.get("/api/vm/latest", (req, res) => {
  db.get(
    "SELECT * FROM vm_metrics ORDER BY timestamp DESC LIMIT 1",
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    }
  );
});

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
