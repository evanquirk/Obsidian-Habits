// src/utils/yamlUtility.js

const fs = require('fs');
const yaml = require('js-yaml');
const inquirer = require('inquirer');

/**
 * Extracts the YAML front matter and Markdown content from a file's content.
 * @param {string} fileContent The entire content of the file.
 * @returns {object} An object containing the separated YAML and Markdown content.
 */
const extractYAML = (fileContent) => {
    const yamlStartRegex = /^---\s*/; // Start of YAML front matter
    const yamlEndRegex = /\n---\s*/;  // End of YAML front matter

    let yamlContent = '';
    let markdownContent = fileContent;

    if (fileContent.startsWith('---')) {
        const start = fileContent.indexOf('---') + 3; // Skip the first ---
        const end = fileContent.indexOf('---', start); // Find the second ---
        
        if (end !== -1) {
            yamlContent = fileContent.substring(start, end).trim();
            markdownContent = fileContent.substring(end + 3); // Skip the second ---
        }
    }

    return { yamlContent, markdownContent };
};

/**
 * Allows interactive editing of YAML content using inquirer.
 * @param {string} yamlContent The YAML content to edit.
 * @returns {string} The updated YAML content as a string.
 */
const editYAML = async (yamlContent) => {
    if (!yamlContent) {
        throw new Error('No YAML content provided to edit');
    }

    try {
        const yamlData = yaml.load(yamlContent); // Loads only a single YAML document
        const questions = Object.keys(yamlData).map(key => ({
            type: 'input',
            name: key,
            message: `Edit ${key}:`,
            default: yamlData[key], // pre-fill the current value
        }));

        const answers = await inquirer.prompt(questions);
        return yaml.dump(answers); // Converts JavaScript object back to a single YAML document
    } catch (error) {
        console.error('Failed to parse YAML content:', error);
        throw error;
    }
};

/**
 * Saves updated YAML content back to the file, combining it with the Markdown content.
 * @param {string} filePath The path to the file to save.
 * @param {string} newYAMLContent The updated YAML content.
 * @param {string} markdownContent The unchanged Markdown content.
 */
const saveUpdatedYAML = (filePath, newYAMLContent, markdownContent) => {
    const newContent = `---\n${newYAMLContent}---\n${markdownContent}`;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated content saved to ${filePath}`);
};

module.exports = { extractYAML, editYAML, saveUpdatedYAML };