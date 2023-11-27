// In preload.js
// preload.js
const { contextBridge, shell, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  openExternal: (url) => shell.openExternal(url),
  sendAchievement: (achievementName) => {
    ipcRenderer.send("unlock-achievement", achievementName);
  },
  // Include any other functions you need to expose here
});
