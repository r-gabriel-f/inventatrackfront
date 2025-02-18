import { app, BrowserWindow } from 'electron'
import path from 'path'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Mantener una referencia global del objeto window
let mainWindow
let backendProcess

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // Cargar la aplicación
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    mainWindow.webContents.openDevTools();

  }

  // Iniciar el backend
  const backendPath = path.join(__dirname, '../../InventaTrackBack/src/server.js')
  backendProcess = spawn('node', [backendPath], {
    stdio: 'inherit'
  })

  // Manejar el cierre de la ventana
  mainWindow.on('closed', () => {
    mainWindow = null
    if (backendProcess) {
      backendProcess.kill()
    }
  })
}

// Este método se llamará cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
app.whenReady().then(createWindow)

// Salir cuando todas las ventanas estén cerradas.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) {
      backendProcess.kill()
    }
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
app.disableHardwareAcceleration();
