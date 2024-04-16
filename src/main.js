/*

    APPLICATION MAIN PROCESS
    __Electron Main Process__
    
*/

/* IMPORTS & REQUIREMENTS */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const ProjectsManager = require("./main-process/projectsManager");




/* MAIN PROCESS IMPORTS */

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


/* APP DIRECTORIES & FILE STORAGE */
const userDataDir = app.getPath('userData');

const userData = path.join(userDataDir, 'Files');
if (!fs.existsSync(userData)) {
  fs.mkdirSync(userData);
}

const userProjects = path.join(userData, 'Projects');
if (!fs.existsSync(userProjects)) {
  fs.mkdirSync(userProjects); //make projects folder if it doesn't already exist
}


/* APP PROJECT OBJECT */
const APP_PROJECT = new ProjectsManager.Project();



/* CREATE MAIN WINDOW */
const createWindow = () => {

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      csp: "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools(); //open the DevTools.


  // spawn backend server
  var python = require('child_process').spawn('./backend/venv/Scripts/python.exe', ['-u', './backend/main.py']);

  python.stdout.on('data', (data) => {
    console.log("stdout:", data.toString('utf8'));
  });

  python.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


/*
    PROJECT HANDLERS
*/

// Open Project
ipcMain.on('openProject', (event, project_file_path) => {
  
  APP_PROJECT.open(project_file_path, (a, project_data) => {
    event.reply('projectOpened', JSON.stringify(project_data));
  });
});


// Create New Project
ipcMain.on('createProject', (event, project) => {
  
  APP_PROJECT.create(userProjects, project); // create project in main process
});


// Save Project with data sent from the render process
ipcMain.on('saveProject', (event, project) => {
  
  console.log(project);

  APP_PROJECT.log_data(project); // log data into APP_PROJECT
  APP_PROJECT.save(); // save project data
})


// Retrieve list of projects
ipcMain.on('retrieveProjects', (event) => {
  let projects_list = ProjectsManager.retrieve(userProjects, 7);

  event.reply('projectsList', projects_list);
});

