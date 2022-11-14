const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  authEvent: (callback) => ipcRenderer.on("authEvent", callback),
});
