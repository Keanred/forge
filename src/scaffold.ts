import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM-compatible __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const resolvePath = async (projectName?: string) => {
  if (!projectName) throw new Error('Project name is required');

  const templateDir = path.resolve(__dirname, 'templates/express-react');
  const destDir = path.resolve(process.cwd(), projectName);

  if (templateDir === destDir) {
    throw new Error('Template and destination directories must not be the same.');
  }

  await fs.copy(templateDir, destDir, {
    overwrite: false,
    filter: (src) => {
      if (src.includes('node_modules') || src.includes('.git')) {
        return false;
      }
      return true;
    },
  });

  const pkgPath = path.join(destDir, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    let pkgContent = await fs.readFile(pkgPath, 'utf8');
    pkgContent = pkgContent.replace(/\{\{project-name\}\}/g, projectName);
    await fs.writeFile(pkgPath, pkgContent, 'utf8');
  }
};
