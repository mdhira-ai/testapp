const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
const { dialog } = require('electron');


log.transports.file.level = 'info'
autoUpdater.logger = log

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload/preload.js")
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    autoUpdater.checkForUpdatesAndNotify()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


// --- Add these so you can see every stage of the update process ---
autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info.version);
});
autoUpdater.on('update-not-available', () => {
    log.info('No update available (already on latest version)');
});
autoUpdater.on('error', (err) => {
    log.error('Update error:', err);
});
autoUpdater.on('download-progress', (progress) => {
    log.info(`Download progress: ${progress.percent.toFixed(1)}%`);
});
autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded, will install on quit');

    dialog.showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'A new version has been downloaded. Restart now to apply it?',
        buttons: ['Restart', 'Later']
    }).then(result => {
        if (result.response === 0) autoUpdater.quitAndInstall();
    });
});


ipcMain.handle("get-version", () => {
    return app.getVersion()
})