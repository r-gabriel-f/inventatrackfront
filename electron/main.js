import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Mantener una referencia global del objeto window
let mainWindow

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1920, height: 1080,
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

  // Manejar el cierre de la ventana
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Este método se llamará cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
app.whenReady().then(createWindow)

// Salir cuando todas las ventanas estén cerradas.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
app.disableHardwareAcceleration();
