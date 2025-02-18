import { app, BrowserWindow } from "electron";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow;
let backendProcess;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
    mainWindow.webContents.openDevTools();
  }
  const backendPath = path.join(__dirname, "../../InventaTrackBack/src/server.js");
  backendProcess = spawn("node", [backendPath], {
    stdio: "inherit"
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
    if (backendProcess) {
      backendProcess.kill();
    }
  });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (backendProcess) {
      backendProcess.kill();
    }
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
