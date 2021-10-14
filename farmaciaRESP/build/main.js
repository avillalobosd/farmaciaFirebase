const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
// var Sequelize = require('sequelize');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');




let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680});
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
}


app.on('ready', async () => {
  // const dbPath = path.resolve(__dirname, '../src/sqlite/database.db')
  // let db = new sqlite3.Database(dbPath, (err) => {
  //   if (err) {
  //     console.error(err.message);
  //   }
  //   console.log('Connected to the database.');
  // });
  createWindow();
  // await connectDB();

});

// app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});