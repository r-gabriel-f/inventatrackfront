import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
path.dirname(fileURLToPath(import.meta.url));
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  const localServerUrl = "http://localhost:3001";
  mainWindow.loadURL(localServerUrl);
  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
app.disableHardwareAcceleration();
