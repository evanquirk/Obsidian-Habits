require('dotenv').config();
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');


const basePath = process.env.VAULT_PATH;

function getRelativePathParts(fullPath) {

    const partsAfterVault = fullPath.split(`/${VAULT_NAME}/`)[1];
    return partsAfterVault.split(path.sep);
}

function updateFrontmatter(relativePathParts, frontmatter = {}) {
  if (relativePathParts.length === 0) {
      return { area: "Inbox" };
  }

  const fileName = relativePathParts.pop();
  if (fileName.includes('AA Administration')) {
      return null; // Skip template files.
  }

  let area = "", category = "", subCategory = "", decimalCode = "";

  if (relativePathParts.length > 0) {
      const areaPart = relativePathParts[0];
      const areaParts = areaPart.split(' ');
      const areaName = areaParts.slice(1).join(' ');
      area = `[[${areaPart}/${areaPart}|${areaName}]]`;
  }

  if (relativePathParts.length >= 2) {
      const categoryPart = relativePathParts[1];
      const categoryParts = categoryPart.split(' ');
      const categoryName = categoryParts.slice(1).join(' ');
      category = `[[${relativePathParts.slice(0, 2).join('/')}/${categoryPart}|${categoryName}]]`;
  }

  if (relativePathParts.length >= 3) {
      const subCategoryPart = relativePathParts[2];
      const subCategoryParts = subCategoryPart.split(' ');
      const subCategoryName = subCategoryParts.slice(1).join(' ');
      subCategory = `[[${relativePathParts.slice(0, 3).join('/')}/${subCategoryPart}|${subCategoryName}]]`;

      const match = subCategoryPart.match(/^(\d+\.\d+) (.+)$/);
      if (match) {
          decimalCode = match[1];
      }
  }

  return {
      ...frontmatter,
      area,
      category,
      'sub-category': subCategory,
      'decimal-code': decimalCode,
  };
}

function processFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const yamlRegex = /---\n([\s\S]*?)\n---/;
        const yamlMatch = fileContent.match(yamlRegex);

        const frontmatter = yamlMatch ? yaml.load(yamlMatch[1]) : {};
        const relativePathParts = getRelativePathParts(filePath);
        const updatedFrontmatter = updateFrontmatter(relativePathParts, frontmatter);

        if (updatedFrontmatter) {
            const newYaml = yaml.dump(updatedFrontmatter).trim();
            const updatedContent = yamlMatch
                ? fileContent.replace(yamlRegex, `---\n${newYaml}\n---`)
                : `---\n${newYaml}\n---\n${fileContent}`;

            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error processing file ${filePath}: ${error}`);
    }
}

function traverseDirectory(directory) {
    console.log(`Traversing ${directory}`);
    const filesAndDirectories = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of filesAndDirectories) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            traverseDirectory(fullPath);
        } else if (entry.isFile() && path.extname(entry.name) === '.md') {
            processFile(fullPath);
        }
    }
}

traverseDirectory(basePath);