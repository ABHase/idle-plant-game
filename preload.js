// In preload.js
const { contextBridge, shell } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  openExternal: (url) => shell.openExternal(url),
});

contextBridge.exposeInMainWorld("steam", {
  // Expose the Steam functions you need
  activateGameOverlay: (options) => Steamworks.activateGameOverlay(options),
  // ... other functions
});
