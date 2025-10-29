import { app, BrowserWindow, Tray, Menu, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import isDev from "electron-is-dev";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

async function createWindow() {
  const preloadPath = isDev 
    ? path.join(__dirname, 'preload.js')
    : path.join(__dirname, '../preload.js');

  mainWindow = new BrowserWindow({
    width: 1511,
    height: 1196,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: {
      y: "60"
    },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
      webviewTag: true,
      devTools: true
    },
  });

  console.log('Preload path:', preloadPath);


  const startURL = isDev
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "dist/index.html")}`;

  console.log('Loading URL:', startURL);
  console.log('isDev:', isDev);
  
  try {
    await mainWindow.loadURL(startURL);
    console.log('Window loaded successfully');
  } catch (error) {
    console.error('Failed to load URL:', error);
  }

  mainWindow.on("closed", () => {
      console.log(mainWindow.width)
      console.log(mainWindow.height)
      mainWindow = null
  });
}

app.on("ready", createWindow);

// Commented out tray - causing errors
/*
let tray = null
app.whenReady().then(() => {
  tray = new Tray('/path/to/my/icon')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})
*/



app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handler for launching Nebula Browser
ipcMain.handle('launch-nebula', async () => {
  const batPath = path.join(__dirname, '..', 'LAUNCH_NEBULA_QUICK.bat');
  
  return new Promise((resolve, reject) => {
    exec(`"${batPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error launching Nebula:', error);
        reject(error.message);
      } else {
        console.log('Nebula launched successfully');
        resolve('Nebula Browser started!');
      }
    });
  });
});
