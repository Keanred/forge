import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ProjectConfig } from 'types';
import { vitestExpress, vitestReact } from 'vitest.js';
import { listTemplates } from './templates/registry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const resolvePath = async (projectConfig: ProjectConfig) => {
  if (!projectConfig.name) throw new Error('Project name is required');
  const templates = listTemplates();
  const selectedTemplate = templates.find((t) => t.name.toLowerCase() === projectConfig.template);

  const templateDir = path.resolve(__dirname, selectedTemplate!.dirPath);
  const destDir = path.resolve(process.cwd(), projectConfig.name);

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

  // Testing enabled include vitest.config.ts and test directory and vitest
  // dependecies in package.json
  if (projectConfig.testing) {
    const vitestConfigPath = path.join(destDir, 'vitest.config.ts');
    if (projectConfig.template === 'react') {
      await fs.writeFile(vitestConfigPath, vitestReact, 'utf8');
    } else if (projectConfig.template === 'express') {
      await fs.writeFile(vitestConfigPath, vitestExpress, 'utf-8');
    }
  }

  const pkgTemplatePath = path.join(destDir, 'package.json.template');
  const pkgPath = path.join(destDir, 'package.json');
  if (await fs.pathExists(pkgTemplatePath)) {
    let pkgContent = await fs.readFile(pkgTemplatePath, 'utf8');
    pkgContent = pkgContent.replace(/\{\{project-name\}\}/g, projectConfig.name);
    await fs.writeFile(pkgPath, pkgContent, 'utf8');
  }
};
