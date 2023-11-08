const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const { buildTrayIcon } = require('./trayIcon');
const path = require('path');

let mainWindow = null;

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'icon.ico'),
  });

  mainWindow.loadFile('index.html');
  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  globalShortcut.register('CmdOrCtrl+Shift+i', () => {
    mainWindow.webContents.toggleDevTools();
  });

  const filter = {
    urls: ['http://localhost/callback*', 'http://localhost:4200/callback*'],
  };

  const {
    session: { webRequest },
  } = mainWindow.webContents;

  webRequest.onBeforeRequest(filter, ({ url }) => {
    mainWindow.webContents.send('authEvent', url);
  });

  buildTrayIcon(mainWindow);

  if (process.platform === 'win32') {
    app.setAppUserModelId(app.name);
  }
};

app.isReady() ? createWindow() : app.on('ready', createWindow);
