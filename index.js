
require('dotenv').config();
const { parseDate } = require('./src/utils/dateUtility');
const setupYargs  = require('./src/config/cliConfig');
const { promptForMissing } = require('./src/utils/inquirePrompt');
const { handleFileProcessing } = require('./src/utils/fileManager');
const { extractYAML, editYAML, saveUpdatedYAML } = require('./src/utils/yamlUtility');

async function main() {
    // Setup and handle command-line arguments
    let argv = await setupYargs().argv;
    argv = await promptForMissing(argv);

    // Parse the date provided by the user or default to today
    const date = parseDate(argv.date);

    // Ensure the base file path is set via environment variables
    const baseFilePath = process.env.NOTES_PATH;
    if (!baseFilePath) {
        throw new Error('Base file path (NOTES_PATH) is not defined in environment variables.');
    }

    // Handle the file based on the date and obtain the path and content
    const { filePath, fileContent } = handleFileProcessing(baseFilePath, date);

    // Extract YAML and Markdown content from the file
    const { yamlContent, markdownContent } = extractYAML(fileContent);

    // Check if there is YAML content to edit and proceed if true
    if (yamlContent) {
        const updatedYAML = await editYAML(yamlContent);
        saveUpdatedYAML(filePath, updatedYAML, markdownContent);
        console.log('YAML content updated successfully.');
    } else {
        console.log("No YAML content found to edit.");
    }
}

main().catch(err => {
    console.error('Failed to execute task:', err);
});