// index.js

import { format } from 'date-fns';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { config } from 'dotenv';
import { setupYargs } from './config/cli-config';
import { promptForMissing } from './config/interactive-prompts';
import { parseDate } from './utils/date-utils';

config();

async function main() {
    let argv = setupYargs().argv;
    argv = await promptForMissing(argv);

    const date = parseDate(argv.date);
    const baseFilePath = process.env.NOTES_PATH!;
    const dateString = format(date, 'yyyy/MM');
    const filePath = path.join(baseFilePath, dateString, `${format(date, 'yyyy-MM-dd')}.md`);

    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (match) {
            const existingData = yaml.load(match[1]);
            console.log('Existing data:', existingData);
        }
    }
}

main().catch(err => {
    console.error('Failed to execute task:', err);
});