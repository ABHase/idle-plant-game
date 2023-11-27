const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

let mainWindow;

const steamworks = require("steamworks.js");

const client = steamworks.init(2701250);

ipcMain.on("unlock-achievement", (event, achievementName) => {
  console.log(
    `[main.js] Received achievement unlock request: ${achievementName}`
  );
  try {
    if (client.achievement.activate(achievementName)) {
      console.log("Achievement activated successfully." + achievementName);
    } else {
      console.log("Failed to activate achievement." + achievementName);
    }
  } catch (error) {
    console.error(`[main.js] Error activating achievement: ${error.message}`);
    event.reply("achievement-unlock-response", "failure");
  }
  event.reply("achievement-unlock-response", "success");
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    icon: __dirname + "/favicon.ico",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: false,
      backgroundThrottling: false,
    },
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

require("steamworks.js").electronEnableSteamOverlay();
