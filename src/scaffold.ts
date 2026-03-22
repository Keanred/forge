import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ProjectConfig } from 'types';
import { generatePackageJson } from './generators/package-json.js';
import { generateReadme } from './generators/readme.js';
import { buildContext, renderTemplate } from './template-engine.js';
import { listTemplates } from './templates/registry.js';
import { vitestExpress, vitestReact } from './vitest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const resolvePath = async (projectConfig: ProjectConfig) => {
  if (!projectConfig.name) throw new Error('Project name is required');
  const templates = listTemplates();
  const selectedTemplate = templates.find((t) => t.id.toLowerCase() === projectConfig.template.toLowerCase());

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

  // If testing enabled: write vitest config and create test directories
  if (projectConfig.testing) {
    const template = projectConfig.template.toLowerCase();
    const vitestConfigPath = path.join(destDir, 'vitest.config.ts');

    if (template === 'react') {
      await fs.writeFile(vitestConfigPath, vitestReact, 'utf8');
      await fs.ensureDir(path.join(destDir, 'src', 'test'));
      await fs.writeFile(path.join(destDir, 'src', 'test', 'setup.ts'), "import '@testing-library/jest-dom';", 'utf8');
    } else if (template === 'express') {
      await fs.writeFile(vitestConfigPath, vitestExpress, 'utf8');
      await fs.ensureDir(path.join(destDir, 'tests'));
    }
  }

  // If typescript is disabled: remove tsconfig.json and swap eslint config to JS version
  if (!projectConfig.typescript) {
    // Remove TypeScript config
    const tsconfigPath = path.join(destDir, 'tsconfig.json');
    if (await fs.pathExists(tsconfigPath)) {
      await fs.remove(tsconfigPath);
    }

    // Swap eslint.config.ts to eslint.config.js (TypeScript -> JavaScript)
    const eslintTsPath = path.join(destDir, 'eslint.config.ts');
    const eslintJsPath = path.join(destDir, 'eslint.config.js');
    if (await fs.pathExists(eslintTsPath)) {
      await fs.remove(eslintTsPath);
    }
    if (await fs.pathExists(eslintJsPath)) {
      // JavaScript config already exists (for standalone React template), keep it
    }

    // Rename .ts/.tsx files to .js/.jsx
    const tsFiles = await glob('**/*.{ts,tsx}', { cwd: destDir, absolute: true });
    for (const file of tsFiles) {
      const newFile = file.replace(/\.tsx?$/, (match) => (match === '.tsx' ? '.jsx' : '.js'));
      await fs.rename(file, newFile);
    }
  }

  // Apply template engine to any .template files copied from the template directory
  const context = buildContext(projectConfig);
  const templateFiles = await glob('**/*.template', { cwd: destDir, absolute: true });
  for (const file of templateFiles) {
    const content = await fs.readFile(file, 'utf8');
    const rendered = renderTemplate(content, context);
    const destFile = file.replace(/\.template$/, '');
    await fs.writeFile(destFile, rendered, 'utf8');
    await fs.remove(file);
  }

  // Write package.json using the generator (overrides any template-rendered version)
  const packageJson = generatePackageJson(projectConfig);
  await fs.writeJSON(path.join(destDir, 'package.json'), packageJson, { spaces: 2 });

  // Write README.md
  const readme = generateReadme(projectConfig);
  await fs.writeFile(path.join(destDir, 'README.md'), readme, 'utf8');
};
