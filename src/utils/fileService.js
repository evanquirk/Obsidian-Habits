// src/utils/fileService.js

const fs = require('fs');
const path = require('path');

// Assuming the environment variable TEMPLATE_DIR points to the directory containing templates
const TEMPLATE_DIR = process.env.TEMPLATE_PATH;

/**
 * Creates a file from a specified template.
 * @param {string} filePath The path where the new file will be created.
 */
const createFileFromTemplate = (filePath) => {
    if (!filePath) {
        throw new Error('File path is undefined in createFileFromTemplate');
    }

    // Define the name of the template file
    const templateFileName = 'Daily.md';
    const templatePath = path.join(TEMPLATE_DIR, templateFileName);

    // Check if the template exists before attempting to read
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found at ${templatePath}`);
    }

    // Read the content from the template file
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    // Ensure the directory exists before writing the file
    ensureDirectoryExistence(filePath);

    // Write the content from the template to the new file path
    fs.writeFileSync(filePath, templateContent);
    console.log(`File created at ${filePath} using the template from ${templatePath}`);
};

/**
 * Ensures the directory of a given file path exists. If not, creates it.
 * @param {string} filePath The path of the file whose directory needs checking.
 */
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    fs.mkdirSync(dirname, { recursive: true });
    return true;
};

module.exports = { createFileFromTemplate };