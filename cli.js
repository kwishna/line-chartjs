#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command-line arguments using yargs
const argv = yargs(hideBin(process.argv))
    .usage('Usage: npx line-chartjs <db-directory> [options]')
    .demandCommand(1, 'You need to specify the database directory')
    .option('port', {
        alias: 'p',
        type: 'number',
        description: 'Port to run the server on',
        default: 3001
    })
    .help()
    .argv;

const dbDirectory = argv._[0];
const port = argv.port;

console.log(`Your have mentioned your data directory: ${dbDirectory}.`);
process.env.DATA_FOLDER = dbDirectory;
process.env.EXPRESS_PORT = port;

// Start the main application with the provided directory and port
const indexPath = path.join(__dirname, 'src/index.js');
const command = `node ${indexPath} "${dbDirectory}"`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Error: ${stderr}`);
        return;
    }
    console.log(stdout);
});
