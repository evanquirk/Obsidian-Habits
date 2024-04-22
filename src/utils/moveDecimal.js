const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Assuming SCHEMA_PATH is set to the JSON file's path in the environment
const schemaPath = process.env.SCHEMA_PATH;
const vaultPath = process.env.VAULT_PATH;

async function loadSchema() {
    try {
        return await fs.readJson(schemaPath);
    } catch (error) {
        console.error(`Error loading schema: ${error}`);
        process.exit(1);
    }
}

function extractFrontMatter(content) {
    const match = content.match(/^---\n([\s\S]+?)\n---/);
    return match ? yaml.load(match[1]) : null;
}

async function findTargetDirectory(frontMatter, schema) {
    // Implement logic to determine the target directory based on the front matter and the schema
    // This is an example and needs to be adjusted to match your schema and front matter structure
    let targetDir = vaultPath;
    if (frontMatter.area && schema[frontMatter.area]) {
        targetDir = path.join(targetDir, frontMatter.area);
    }
    if (frontMatter.category && schema[frontMatter.area][frontMatter.category]) {
        targetDir = path.join(targetDir, frontMatter.category);
    }
    // Add more logic if needed for sub-categories or other metadata

    return targetDir;
}

async function moveFiles() {
    const schema = await loadSchema();

    // Recursively process each file in the vault
    async function processDirectory(directory) {
        const files = await fs.readdir(directory);
        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = await fs.stat(filePath);

            if (stats.isDirectory()) {
                await processDirectory(filePath);
            } else if (filePath.endsWith('.md')) {
                const content = await fs.readFile(filePath, 'utf-8');
                const frontMatter = extractFrontMatter(content);
                const targetDir = await findTargetDirectory(frontMatter, schema);

                if (targetDir && targetDir !== directory) {
                    const targetPath = path.join(targetDir, path.basename(filePath));
                    await fs.move(filePath, targetPath);
                    console.log(`Moved ${filePath} to ${targetPath}`);
                }
            }
        }
    }

    await processDirectory(vaultPath);
}

moveFiles().catch(console.error);
