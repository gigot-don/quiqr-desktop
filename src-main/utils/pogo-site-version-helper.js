/* Copyright Quiqr 2020
 *
 * pim@quiqr.org
 *
 */
const electron      = require('electron')
const fs            = require('fs-extra');
const dialog        = electron.dialog;
const fssimple      = require('fs');
const path          = require("path");
const { lstatSync } = require('fs')
const outputConsole = require('../logger/output-console');
const pathHelper    = require('../utils/path-helper');

class PogoSiteVersionHelper{

    async setSiteVersion(versionDir){
        const mainWindow = global.mainWM.getCurrentInstanceOrNew();

        let siteKey = global.currentSiteKey;
        if(siteKey==""){
            dialog.showMessageBox(mainWindow, {
                type: 'warning',
                title: 'Warning',
                buttons: ["Close"],
                message: "No site selected, cannot switch version.",
            });
        }

        console.log(global.currentSiteKey);
        console.log(versionDir);

        let configFilePath = path.join(pathHelper.getRoot(),'config.'+siteKey+'.json');
        let conftxt = fs.readFileSync(configFilePath);
        var newConf = JSON.parse(conftxt);

        var pathSiteSources = path.join(pathHelper.getRoot(),"sites",siteKey,"sources");
        var pathSource = path.join(pathSiteSources, versionDir);

        if(lstatSync(pathSource).isDirectory()){
            newConf.source.path = pathSource;
            await fssimple.writeFileSync(configFilePath, JSON.stringify(newConf), { encoding: "utf8"});

            outputConsole.appendLine('linked to site version: '+versionDir);

            mainWindow.webContents.send("redirectHome");
        }
        else{
            dialog.showMessageBox(mainWindow, {
                type: 'warning',
                title: 'Warning',
                buttons: ["Close"],
                message: "version directory is not readable",
            });
        }
    }

}

module.exports = new PogoSiteVersionHelper();
