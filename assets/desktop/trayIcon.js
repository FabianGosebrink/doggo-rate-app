const { app, Menu, Tray } = require('electron');
const path = require('path');

const buildTrayIcon = (mainWindow) => {
  const trayIconPath = path.join(__dirname, 'icon.ico');

  const tray = new Tray(trayIconPath);
  tray.setToolTip('my-electron-app');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open application',
      click: function () {
        mainWindow.show();
      },
    },
    {
      label: 'Quit',
      click: function () {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
};

module.exports = {
  buildTrayIcon,
};
