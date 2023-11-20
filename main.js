const { app, BrowserWindow, shell } = require("electron");

const path = require("node:path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "./build/favicon.ico"), // Update with the path to your icon
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: false,
      backgroundThrottling: false,
    },
  });

  //win.removeMenu();

  //win.loadFile("index.html");
  //win.loadURL("http://localhost:3000");
  win.loadURL(`file://${path.join(__dirname, "/build/index.html")}`);
  //win.loadURL(`file://${path.join(__dirname, "/build/index.html")}`);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
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
