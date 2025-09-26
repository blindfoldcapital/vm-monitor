const os = require("os");
const { getCpuUsage, getMemoryUsage } = require("./monitor");

async function drawDashboard() {
  const cpu = await getCpuUsage();
  const mem = getMemoryUsage();
  const [load1, load5, load15] = os.loadavg();

  console.clear();
  console.log("📊 VM Monitor Dashboard\n");
  console.log(
    `CPU Usage   : ${cpu}%\n` +
    `Memory Usage: ${mem}%\n` +
    `Load Avg    : 1m=${load1.toFixed(2)}  5m=${load5.toFixed(2)}  15m=${load15.toFixed(2)}`
  );
}

function startDashboard(interval = 2000) {
  setInterval(drawDashboard, interval);
}

module.exports = { startDashboard };
