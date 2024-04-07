// utils/fileService.js

const fs = require('fs');
const path = require('path');

const TEMPLATE_DIR = process.env.TEMPLATE_PATH; // Ensure this environment variable is set

const createFileFromTemplate = (filePath) => {
    if (!filePath) {
        throw new Error('File path is undefined in createFileFromTemplate');
    }

    const templateFileName = 'Daily.md';
    const templatePath = path.join(TEMPLATE_DIR, templateFileName);

    // Check if the template exists before attempting to read
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found at ${templatePath}`);
    }

    const templateContent = fs.readFileSync(templatePath, 'utf8');
    fs.writeFileSync(filePath, templateContent);

    console.log(`File created at ${filePath} using the template from ${templatePath}`);
};

module.exports = createFileFromTemplate;