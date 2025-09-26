const os = require("os");
const db = require("./db");

// Helper: snapshot CPU
function getCpuInfo() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;

  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      total += cpu.times[type];
    }
    idle += cpu.times.idle;
  });

  return { idle, total };
}

// CPU % (sampled over 1 second)
function getCpuUsage() {
  return new Promise((resolve) => {
    const start = getCpuInfo();
    setTimeout(() => {
      const end = getCpuInfo();
      const idle = end.idle - start.idle;
      const total = end.total - start.total;
      const usage = 100 - Math.round((100 * idle) / total);
      resolve(usage);
    }, 1000);
  });
}

// Memory %
function getMemoryUsage() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  return ((used / total) * 100).toFixed(2);
}

// Record to DB
async function recordVmMetrics() {
  const cpu_usage = await getCpuUsage();
  const [load1, load5, load15] = os.loadavg();
  const memory_usage = getMemoryUsage();

  db.run(
    "INSERT INTO vm_metrics (cpu_usage, load1, load5, load15, memory_usage) VALUES (?, ?, ?, ?, ?)",
    [cpu_usage, load1, load5, load15, memory_usage]
  );

  console.log(
    `Recorded | CPU: ${cpu_usage}% | Mem: ${memory_usage}% | Load: ${load1}, ${load5}, ${load15}`
  );
}

module.exports = { recordVmMetrics };
