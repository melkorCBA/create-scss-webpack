#!/usr/bin/env node
const { execSync } = require('child_process');
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
                case PLATFORMS.Windows:
                    return `rm -rf`;
                default: '';
            }
        }

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
                deleteBinFolder: `cd ${projectName} && ${GetPlatformSpecificCommand(COMMANDS.DELETE_FOLDER)} .bin`


            }
        }
    }
}

module.exports = { CommandManager, ConsoleLog };