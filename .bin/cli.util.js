#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs').promises
const path = require("path");
const { ENVIRONMENTS, PLATFORMS, COMMANDS, Environment, GIT_URL } = require('./cli.config')

const ConsoleLog = input => {
    if (Environment !== ENVIRONMENTS.Prod) {
        console.log(input);
    }
}

const GetPlatformSpecificCommand = function (command) {
    const Platform = process.platform;
    switch (command) {
        case COMMANDS.DELETE_FOLDER: {
            switch (Platform) {
                case PLATFORMS.Windows:
                    return `rmdir /s /Q`;
                case PLATFORMS.Linux:
                case PLATFORMS.MAC:
                case PLATFORMS.Andriod:
                case PLATFORMS.FreeBSD:
                case PLATFORMS.OpenBSD:
                case PLATFORMS.Sunos:
                case PLATFORMS.Xiax:
                    return `rm -rf`;
                default: '';
            }
        }
        default: '';

    }


}



const CommandManager = (projectName) => {

    return {
        run: command => {
            try {
                const commandOut = execSync(`${command}`, { stdio: 'inherit' });
                ConsoleLog(commandOut)
            }
            catch (e) {
                console.error(`Failed to execute ${command}`, e);
                return false;
            }
            return true;
        },
        getCommands: () => {
            return {
                checkout: `git clone --depth 1 ${GIT_URL} ${projectName}`,
                installDeps: `cd ${projectName} && npm i`,
                deleteRemote: `cd ${projectName} && git remote remove origin`,
                deleteBinFolder: `cd ${projectName} && ${GetPlatformSpecificCommand(COMMANDS.DELETE_FOLDER)} .bin`,
                deleteGitFolder: `cd ${projectName} && ${GetPlatformSpecificCommand(COMMANDS.DELETE_FOLDER)} .git`,
                initGit: `cd ${projectName} && git init`


            }
        }
    }
}

const deleteKeyFromJsObject = (key, object) => {
    const { [key]: remove, ...remaningObject } = object;
    return remaningObject;
}

const deleteKeysFromJsObject = (keys, object) => {
    let objCopy = { ...object }
    Object.keys(keys).forEach((key) => {
        objCopy = deleteKeyFromJsObject(key, objCopy)
    });
    return objCopy
}





const UpdateValuesInPackageFile = async (fileAbspath, keyValuePairsForUpdate = {}, keysForDelete = {}) => {
    ConsoleLog(`file path: ${fileAbspath}`);
    try {
        ConsoleLog(`dirname : ${__dirname}`);
        const file = await fs.readFile(fileAbspath);
        const jobject = JSON.parse(file);
        ConsoleLog(`before delete: ${jobject}`);
        const afterDelete = deleteKeysFromJsObject(keysForDelete, jobject);
        ConsoleLog(`after delete: ${afterDelete}`);
        const updatedJobjet = { ...afterDelete, ...keyValuePairsForUpdate };
        const updatedJson = JSON.stringify(updatedJobjet);
        ConsoleLog(`after update: ${updatedJson}`);
        await fs.writeFile(path.resolve(__dirname, fileAbspath), updatedJson);
        ConsoleLog(`json file updated for ${key}`);
    }
    catch (err) {
        console.warn(error)
    }
}

const getFilePathForProjectCWD = (cwd, projectName, file) => {
    return `${cwd}/${projectName}/${file}`
}



module.exports = { CommandManager, ConsoleLog, UpdateValuesInPackageFile, getFilePathForProjectCWD };