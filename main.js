console.log("Main process starting...");

const { app, BrowserWindow, shell, ipcMain } = require("electron");

const path = require("node:path");

const steamworks = require("steamworks.js");

console.log("steamworks", steamworks);

const client = steamworks.init(2701250);
console.log("Steamworks client initialized:", client);

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
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "./build/favicon.ico"), // Update with the path to your icon
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      backgroundThrottling: false,
    },
  });

  win.loadURL(`file://${path.join(__dirname, "/build/index.html")}`);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    console.log("App is ready");
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

require("steamworks.js").electronEnableSteamOverlay();

module.exports = {
  client,
};
