const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');
const createFileFromTemplate = require('./fileService');

const handleFileProcessing = (baseFilePath, date) => {
  const yearMonth = format(date, 'yyyy/MM');
  const fullDate = format(date, 'yyyy-MM-dd');
  const folderPath = path.join(baseFilePath, yearMonth);
  const filePath = path.join(folderPath, `${fullDate}.md`);

  let fileContent = '';

  if (!fs.existsSync(filePath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      createFileFromTemplate(filePath);
      fileContent = fs.readFileSync(filePath, 'utf8');
      console.log(`File created at ${filePath} using the template.`);
  } else {
      fileContent = fs.readFileSync(filePath, 'utf8');
  }

  return { filePath, fileContent };
};

module.exports = { handleFileProcessing };