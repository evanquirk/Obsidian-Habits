const { format } = require('date-fns');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
require('dotenv').config();
const setupYargs = require('./src/config/cliConfig');
const { promptForMissing } = require('./src/utils/inquirePrompt')
const { parseDate } = require('./src/utils/dateUtility');

async function main() {
    let argv = setupYargs().argv;
    argv = await promptForMissing(argv);

    const date = parseDate(argv.date);
    const baseFilePath = process.env.NOTES_PATH;
    const dateString = format(date, 'yyyy/MM');
    const filePath = path.join(baseFilePath, dateString, `${format(date, 'yyyy-MM-dd')}.md`);
    console.log(date)

    let existingData = {};
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (match) {
            existingData = yaml.load(match[1]);
            console.log('Existing data:', existingData);
        }
    }
}

main().catch(err => {
    console.error('Failed to execute task:', err);
});