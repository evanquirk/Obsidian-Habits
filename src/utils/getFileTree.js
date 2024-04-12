const fs = require('fs/promises');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const vaultBasePath = process.env.VAULT_PATH; // Define the base path for the vault

// Helper function to format Markdown links
function formatMarkdownLink(basePath, name) {
    const formattedPath = path.join(basePath, `${name}.md`).replace(/\\/g, '/'); // Ensure cross-platform compatibility
    return `"[[${formattedPath}|${name}]]"`;
}

// Recursively map directory structure and generate rows for CSV
async function mapDirectory(dir, relativePathFromVault = '', level = 0, parentInfo = { area: { name: '', path: '', markdown: '' }, category: { name: '', path: '', markdown: '' }, subCategory: { name: '', path: '', markdown: '', decimalCode: '' }, specific: { name: '', path: '', markdown: '' } }) {
  let rows = [];
  const files = await fs.readdir(dir);

  for (const file of files) {
      if (file.startsWith('.') || file === "AA Administration") continue;

      const fullFilePath = path.join(dir, file);
      const relativeFilePathFromVault = path.join(relativePathFromVault, file);
      const stats = await fs.stat(fullFilePath);

      if (stats.isDirectory()) {
          const nameMatch = file.match(/^(\d{2}(?:\.\d{2})?)\s(.+)$/); // Adjusted to capture "XX.XX Name"
          const decimalCode = nameMatch ? nameMatch[1] : ''; // Captures "XX.XX"
          const descriptiveName = nameMatch ? nameMatch[2] : file; // Name without the numeric prefix

          // Generate markdown links for current directory
          const currentMarkdown = formatMarkdownLink(relativeFilePathFromVault, descriptiveName);

          // Update parent info for markdown links based on current level
          if (level === 0) {
              parentInfo.area = { name: descriptiveName, path: relativeFilePathFromVault, markdown: currentMarkdown };
          } else if (level === 1) {
              parentInfo.category = { name: descriptiveName, path: relativeFilePathFromVault, markdown: currentMarkdown };
          } else if (level === 2) {
              parentInfo.subCategory = { name: descriptiveName, path: relativeFilePathFromVault, markdown: currentMarkdown, decimalCode: decimalCode };
          } else if (level === 3) {
              parentInfo.specific = { name: descriptiveName, path: relativeFilePathFromVault, markdown: currentMarkdown };
          }

          // Collect data from this directory before diving deeper
          rows.push({
              path: relativeFilePathFromVault.replace(vaultBasePath + '/', ''),
              areaName: parentInfo.area.name,
              categoryName: parentInfo.category.name,
              subCategoryName: parentInfo.subCategory.name,
              specificName: parentInfo.specific.name,
              area: parentInfo.area.path.replace(vaultBasePath + '/', ''),
              category: parentInfo.category.path.replace(vaultBasePath + '/', ''),
              subCategory: parentInfo.subCategory.path.replace(vaultBasePath + '/', ''),
              specific: parentInfo.specific.path.replace(vaultBasePath + '/', ''),
              decimalCode: parentInfo.subCategory.decimalCode,
              type: 'directory',
              areaMarkdown: parentInfo.area.markdown,
              categoryMarkdown: parentInfo.category.markdown,
              subCategoryMarkdown: parentInfo.subCategory.markdown,
              specificMarkdown: level === 3 ? parentInfo.specific.markdown : '',
          });

          // Recursively process sub-directories with updated parentInfo
          const childRows = await mapDirectory(fullFilePath, relativeFilePathFromVault, level + 1, {...parentInfo});
          rows = rows.concat(childRows);
      }
  }

  return rows;
}

async function main() {
    try {
        const rows = await mapDirectory(vaultBasePath);
        if (rows.length === 0) {
            console.log("No data found in the specified directory.");
        } else {
            const csvWriter = createCsvWriter({
                path: 'vault_structure.csv',
                header: [
                    {id: 'path', title: 'Path'},
                    {id: 'areaName', title: 'Area Name'},
                    {id: 'area', title: 'Area'},
                    {id: 'categoryName', title: 'Category Name'},
                    {id: 'category', title: 'Category'},
                    {id: 'subCategoryName', title: 'Sub-Category Name'},
                    {id: 'subCategory', title: 'Sub-Category'},
                    {id: 'specificName', title: 'Specific Name'},
                    {id: 'specific', title: 'Specific'},
                    {id: 'decimalCode', title: 'Decimal Code'},
                    {id: 'type', title: 'Type'},
                    {id: 'areaMarkdown', title: 'Area Markdown'},
                    {id: 'categoryMarkdown', title: 'Category Markdown'},
                    {id: 'subCategoryMarkdown', title: 'Sub-Category Markdown'},
                    {id: 'specificMarkdown', title: 'Specific Markdown'}
                ]
            });

            await csvWriter.writeRecords(rows.filter(row => row.type === 'directory')); // Filter only directories
            console.log('CSV file has been written to vault_structure.csv');
        }
    } catch (err) {
        console.error('Error processing the vault:', err);
    }
}

main();


