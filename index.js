require('dotenv').config();
const setupYargs = require('./src/config/cliConfig');
const { promptForMissing } = require('./src/utils/inquirePrompt')
const { parseDate } = require('./src/utils/dateUtility');
const handleFileProcessing  = require('./src/utils/fileManager');

async function main() {
    let argv = await setupYargs().argv;
    argv = await promptForMissing(argv);

    const date = parseDate(argv.date);
    const baseFilePath = process.env.NOTES_PATH;

    if (!baseFilePath) {
        throw new Error('NOTES_PATH environment variable is not set.');
    }

    handleFileProcessing(baseFilePath, date);
}

main().catch(err => {
    console.error('Failed to execute task:', err);
});