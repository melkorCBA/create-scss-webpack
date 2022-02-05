#!/usr/bin/env node
const { CommandManager } = require('./cli.util')

const inputProjectName = process.argv[2];
const { run, getCommands } = CommandManager(inputProjectName);
const { checkout, installDeps, deleteRemote, deleteBinFolder } = getCommands();


console.log(`Creating new scss project ${inputProjectName}`);
const isCheckoutSuccess = run(checkout);
if (!isCheckoutSuccess) process.exit(-1);

console.log(`Installing dependencies for project ${inputProjectName}`);
const isInstallDepsSuccess = run(installDeps);
// remove git remote
const deleteRemoteSuccess = run(deleteRemote);
// deleting bin folder
const deleteBinFolderSuccess = run(deleteBinFolder);

if (!isInstallDepsSuccess && deleteRemoteSuccess && deleteBinFolderSuccess) process.exit(-1);

console.log('All Done!. Please run following commands to start')
console.info(`cd ${inputProjectName}`);
console.log('Serve locally')
console.log('npm run start')

