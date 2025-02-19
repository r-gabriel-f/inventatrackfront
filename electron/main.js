import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer } from 'net'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDev = process.env.NODE_ENV === 'development'
const BASE_PORT = 65535

function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.listen(startPort, () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
    server.on('error', () => {
      // Port is in use, try the next one
      findAvailablePort(startPort + 1).then(resolve, reject)
    })
  })
}

// Crear servidor express para producción
async function createExpressServer() {
  const port = await findAvailablePort(BASE_PORT)
  const server = express()
  server.use(express.static(path.join(__dirname, '../dist')))
  return new Promise((resolve) => {
    const serverInstance = server.listen(port, () => {
      console.log(`Server running on port ${port}`)
      resolve({ server: serverInstance, port })
    })
  })
}

// Mantener una referencia global del objeto window
let mainWindow

async function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1920, height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  let serverPort = BASE_PORT
  
  // Cargar la aplicación
  if (isDev) {
    // En desarrollo, cargar desde el servidor de Vite
    await mainWindow.loadURL('http://localhost:65535')
    mainWindow.webContents.openDevTools()
  } else {
    // En producción, cargar desde el servidor express local
    const { port } = await createExpressServer()
    serverPort = port
    await mainWindow.loadURL(`http://localhost:${port}`)
  }


  // Manejar el cierre de la ventana
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Este método se llamará cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
app.whenReady().then(async () => {
  await createWindow()
})

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
