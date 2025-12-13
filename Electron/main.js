const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const http = require("http");

app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-features", "CalculateNativeWinOcclusion");

let backendProcess;

app.setAppUserModelId("com.jenapp.desktop");

function apiExePath() {
  return path.join(process.resourcesPath, "api", "Webapi.exe");
}

function logToFile(msg) {
  try {
    fs.appendFileSync(
      path.join(app.getPath("userData"), "backend.log"),
      `[${new Date().toISOString()}] ${msg}\n`
    );
  } catch {}
}

function startBackend() {
  const exe = apiExePath();
  if (!fs.existsSync(exe)) return;

  backendProcess = spawn(exe, [], {
    cwd: path.dirname(exe),
    windowsHide: true,
    detached: true,
    stdio: "ignore",
  });
}

function waitForApi(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve) => {
    const check = () => {
      http
        .get(url, (res) => {
          res.resume();
          resolve(true);
        })
        .on("error", () => {
          if (Date.now() - start > timeoutMs) resolve(false);
          else setTimeout(check, 300);
        });
    };
    check();
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#fff",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  await win.loadFile(path.join(process.resourcesPath, "react", "index.html"));

  win.once("ready-to-show", () => {
    win.show();
    win.focus();
  });
}

app.whenReady().then(async () => {
  startBackend();
  await waitForApi("http://localhost:5132/swagger");
  await createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("will-quit", () => {
  backendProcess?.kill();
});
