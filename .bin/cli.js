#!/usr/bin/env node
const { execSync } = require('child_process');
const CommandManager = (projectName) => {

    return {
        run: command => {
            try {
                execSync(`${command}`, { stdio: 'inherit' });
            }
            catch (e) {
                console.error(`Failed to execute ${command}`, e);
                return false;
            }
            return true;
        },
        getCommands: () => {
            return {
                checkout: `git clone --depth 1 https://github.com/melkorCBA/create-scss-webpack ${projectName}`,
                installDeps: `cd ${projectName} && npm i`
            }
        }
    }





}

const inputProjectName = process.argv[2];
const { run, getCommands } = CommandManager(inputProjectName);
const { checkout, installDeps } = getCommands();


console.log(`Creating new scss project ${inputProjectName}`);
const isCheckoutSuccess = run(checkout);
if (!isCheckoutSuccess) process.exit(-1);

console.log(`Installing dependencies for project ${inputProjectName}`);
const isInstallDepsSuccess = run(installDeps);
if (!isInstallDepsSuccess) process.exit(-1);

console.log('All Done!. Please run folloeing commands to start')
console.info(`cd ${inputProjectName}`);
console.log('Serve locally')
console.log('npm run start')

