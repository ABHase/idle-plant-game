// In preload.js
// preload.js
const { contextBridge, shell, ipcRenderer } = require("electron");

ipcRenderer.on("achievement-unlock-response", (event, arg) => {
  console.log(arg); // Log the response from the main process
});

contextBridge.exposeInMainWorld("electron", {
  openExternal: (url) => shell.openExternal(url),
  sendAchievement: (achievementName) => {
    console.log("unlock-achievement", achievementName);
    console.log("ipcRenderer", ipcRenderer);
    ipcRenderer.send("unlock-achievement", achievementName);
  },
  onAchievementResponse: (callback) => {
    ipcRenderer.on("achievement-unlock-response", (event, arg) => {
      callback(arg);
    });
  },
  // Include any other functions you need to expose here
});
