//config/cliConfig.js

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const setupYargs = () => {
    return yargs(hideBin(process.argv))
        .option('task', {
            alias: 't',
            describe: 'Task to perform',
            type: 'string'
        })
        .option('date', {
            alias: 'd',
            describe: 'Date for the task',
            type: 'string',
            default: 'today'
        });
}

module.exports = setupYargs;