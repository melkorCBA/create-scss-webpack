#!/usr/bin/env node
const { CommandManager, UpdateValuesInPackageFile, ConsoleLog, getFilePathForProjectCWD } = require('./cli.util')

const inputProjectName = process.argv[2];
let author = ''



const { run, getCommands } = CommandManager(inputProjectName);
const { checkout, installDeps, deleteRemote, deleteBinFolder, deleteGitFolder, initGit } = getCommands();



console.log(`Creating new scss project ${inputProjectName}`);
const isCheckoutSuccess = run(checkout);
if (!isCheckoutSuccess) process.exit(-1);

console.log(`Installing dependencies for project ${inputProjectName}`);
run(installDeps);

// remove git remote
run(deleteRemote);
// deleting bin folder
run(deleteBinFolder);
// deleting exsisting git 
run(deleteGitFolder);
// initlize new git
run(initGit);

// delete unwanted fields from packae.json
const packageJsonLocation = getFilePathForProjectCWD(process.cwd(), inputProjectName, 'package.json');
UpdateValuesInPackageFile(packageJsonLocation,
    {
        author,
        version: '1.0.0',
        name: '' + inputProjectName,
        description: ''
    },
    {
        bin: 'bin',
        repository: 'repository',
        keywords: 'keywords'
    })
    .then(() => ConsoleLog('removed repository field from package.json'))
    .catch((err) => {
        console.warn('removed repository field from package.json');
        process.exit(-1);
    })

//if (!isInstallDepsSuccess && !deleteRemoteSuccess && !deleteBinFolderSuccess && !deleteGitFolderSuccess) process.exit(-1);

console.log('All Done!. Please run following commands to start')
console.info(`cd ${inputProjectName}`);
console.log('Serve locally')
console.log('npm run start')

