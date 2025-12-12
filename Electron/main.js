const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const http = require("http");

let backendProcess;

function apiExePath() {
  // EN APP INSTALADA (producción)
  return path.join(process.resourcesPath, "api", "Webapi.exe");
}

function logToFile(msg) {
  try {
    const file = path.join(app.getPath("userData"), "backend.log");
    fs.appendFileSync(file, `[${new Date().toISOString()}] ${msg}\n`);
  } catch {}
}

function startBackend() {
  const exe = apiExePath();

  logToFile(`Buscando API en: ${exe}`);

  if (!fs.existsSync(exe)) {
    logToFile(`❌ NO existe Webapi.exe en esa ruta`);
    return;
  }

  backendProcess = spawn(exe, [], {
    cwd: path.dirname(exe),
    windowsHide: true,
    detached: false,
    stdio: ["ignore", "pipe", "pipe"],
  });

  backendProcess.on("error", (err) => {
    logToFile(`❌ spawn error: ${err.message}`);
  });

  backendProcess.on("exit", (code, signal) => {
    logToFile(`❌ API salió. code=${code} signal=${signal}`);
  });

  backendProcess.stdout.on("data", (d) => logToFile(`API: ${d.toString()}`));
  backendProcess.stderr.on("data", (d) =>
    logToFile(`API ERR: ${d.toString()}`)
  );

  logToFile(`✅ spawn OK (pid=${backendProcess.pid})`);
}

function waitForApi(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve) => {
    const tick = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve(true);
      });
      req.on("error", () => {
        if (Date.now() - start > timeoutMs) return resolve(false);
        setTimeout(tick, 300);
      });
    };
    tick();
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
  });

  const indexPath = path.join(process.resourcesPath, "react", "index.html");
  logToFile(`Cargando React: ${indexPath}`);

  win.loadFile(indexPath);

  win.webContents.once("did-finish-load", () => win.show());
  win.webContents.openDevTools();
}

app.whenReady().then(async () => {
  startBackend();

  const ok = await waitForApi("http://localhost:5132/swagger", 15000);
  logToFile(ok ? "✅ API respondió" : "❌ API NO respondió (timeout)");

  await createWindow();
});

app.on("will-quit", () => {
  if (backendProcess) backendProcess.kill();
});
