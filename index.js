// index.js

const { format, parseISO } = require('date-fns');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const readline = require('readline');
require('dotenv').config();

// ParseDate from command line input
const parseDate = (dateInput) => {
    if (dateInput === 'today') {
        return new Date();
    } else if (dateInput === 'yesterday') {
        return new Date(new Date().setDate(new Date().getDate() - 1));
    } else {
        return parseISO(dateInput);
    }
  }

async function main() {
    const [dateInput] = process.argv.slice(2);
    const date = parseDate(dateInput || 'today');
    const baseFilePath = process.env.NOTES_PATH
    const dateString = format(date, 'yyyy/MM');
    const filePath = path.join(baseFilePath, dateString, `${format(date, 'yyyy-MM-dd')}.md`);

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