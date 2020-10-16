const { app, BrowserWindow } = require('electron');

function createWindow(){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true,
            webviewTag: true
        }
    });
    win.removeMenu();

    win.loadFile('app/index.html');
    
    // Enlever les deux / pour avoir le truc de debug de chrome
    //win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})