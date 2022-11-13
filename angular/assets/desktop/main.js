const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");

const { buildTrayIcon } = require("./trayIcon");

let mainWindow = null;

app.on("window-all-closed", () => {
  globalShortcut.unregisterAll();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: __dirname + "/icon.ico",
  });

  mainWindow.loadFile("index.html");
  mainWindow.setMenuBarVisibility(false);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  globalShortcut.register("CmdOrCtrl+Shift+i", () => {
    mainWindow.webContents.toggleDevTools();
  });

  const filter = {
    urls: ["https://localhost/callback*"],
  };

  const {
    session: { webRequest },
  } = mainWindow.webContents;

  webRequest.onBeforeRequest(filter, ({ url }) => {
    mainWindow.webContents.send("authEvent", url);
  });

  buildTrayIcon(mainWindow);
};

app.isReady() ? createWindow() : app.on("ready", createWindow);
