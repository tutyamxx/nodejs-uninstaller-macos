import { app, BrowserWindow } from "electron";

if(process.env.NODE_ENV !== 'development')
{
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

const winURL = process.env.NODE_ENV === "development" ? "http://localhost:9080" : `file://${__dirname}/index.html`;

function createWindow()
{
    let AppWindow = new BrowserWindow(
    {
        width: process.env.NODE_ENV === "development" ? 800: 300,
        height: process.env.NODE_ENV === "development" ? 800 : 460,
        useContentSize: false,
        transparent: true,
        resizable: false,
        frame: false,
        movable: true,
        maximizable: false,
        minimizable: false,
        closable: true,
        hasShadow: true,
        skipTaskbar: true,
        fullscreenable: false,
        title: "Node.JS Uninstaller Mac OS",

        webPreferences:
        {
            nodeIntegration: true
        }
    });

    AppWindow.loadURL(winURL);

    if(process.env.NODE_ENV === "development")
    {
        AppWindow.webContents.openDevTools();
    }

    AppWindow.setMenu(null);

    AppWindow.on("closed", () =>
    {
        AppWindow = null;
    });
};

app.on("ready", createWindow);

app.on("window-all-closed", () =>
{
    if (process.platform !== "darwin")
    {
        app.quit();
    }
});

app.on("activate", () =>
{
    if (BrowserWindow.getAllWindows().length === 0)
    {
        createWindow()
    }
});