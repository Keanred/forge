import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ProjectConfig } from 'types';
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

  // If testing enabled: add vitest config, test directory, and test dependencies
  if (projectConfig.testing) {
    const template = projectConfig.template.toLowerCase();
    const vitestConfigPath = path.join(destDir, 'vitest.config.ts');
    const packageJsonPath = path.join(destDir, 'package.json');
    const packageJson = await fs.readJSON(packageJsonPath);

    if (template === 'react') {
      await fs.writeFile(vitestConfigPath, vitestReact, 'utf8');
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        vitest: '^3.0.8',
        jsdom: '^26.0.0',
        '@testing-library/react': '^16.2.0',
        '@testing-library/jest-dom': '^6.6.3',
        '@testing-library/user-event': '^14.6.1',
      };
      packageJson.scripts = {
        ...packageJson.scripts,
        test: 'vitest run',
        'test:watch': 'vitest',
      };
      await fs.ensureDir(path.join(destDir, 'src', 'test'));
      await fs.writeFile(path.join(destDir, 'src', 'test', 'setup.ts'), "import '@testing-library/jest-dom';", 'utf8');
    } else if (template === 'express') {
      await fs.writeFile(vitestConfigPath, vitestExpress, 'utf8');
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        vitest: '^3.0.8',
        supertest: '^7.0.0',
        '@types/supertest': '^6.0.2',
      };
      packageJson.scripts = {
        ...packageJson.scripts,
        test: 'vitest run',
        'test:watch': 'vitest',
      };
      await fs.ensureDir(path.join(destDir, 'tests'));
    }

    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
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

  // Process package.json.template: substitute {{project-name}} and create package.json
  const pkgTemplatePath = path.join(destDir, 'package.json.template');
  const pkgPath = path.join(destDir, 'package.json');
  if (await fs.pathExists(pkgTemplatePath)) {
    let pkgContent = await fs.readFile(pkgTemplatePath, 'utf8');
    pkgContent = pkgContent.replace(/\{\{project-name\}\}/g, projectConfig.name);
    await fs.writeFile(pkgPath, pkgContent, 'utf8');
    await fs.remove(pkgTemplatePath);
  }
};
