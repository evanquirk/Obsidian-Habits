
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');
const createFileFromTemplate = require('./fileService');

const handleFileProcessing = (baseFilePath, date) => {
    // Format the date to yyyy/MM for the folder and yyyy-MM-dd for the file name
    const yearMonth = format(date, 'yyyy/MM');
    const fullDate = format(date, 'yyyy-MM-dd');
    const folderPath = path.join(baseFilePath, yearMonth);
    const filePath = path.join(folderPath, `${fullDate}.md`);

    // Check if the filePath points to an existing file
    if (!fs.existsSync(filePath)) {
        // Directory may not exist; create it recursively
        fs.mkdirSync(folderPath, { recursive: true });

        // Use the utility function to create a new file from the template
        createFileFromTemplate(filePath);
        console.log(`File created at ${filePath} using the template.`);
    } else {
        try {
            const existingData = fs.readFileSync(filePath, 'utf8');
            console.log(`Existing data in ${filePath}:`, existingData);
        } catch (error) {
            console.error(`An error occurred while reading the file at ${filePath}:`, error);
        }
    }
};

module.exports = handleFileProcessing;