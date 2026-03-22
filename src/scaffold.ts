import fs from 'fs-extra';
import { cwd } from 'node:process';
import { fileURLToPath } from 'node:url';

export const resolvePath = async (projectName?: string) => {
  const path = cwd();
  const templatePath = fileURLToPath(new URL(path, import.meta.url));
  await fs.copy(templatePath, process.cwd(), {
    overwrite: false,
    filter: (src) => {
      if (src.includes('node_modules') || src.includes('.git')) {
        return false;
      }
      return true;
    },
  });

  if (projectName) {
    const pkgPath = `${process.cwd()}/package.json`;
    if (await fs.pathExists(pkgPath)) {
      let pkgContent = await fs.readFile(pkgPath, 'utf8');
      pkgContent = pkgContent.replace(/\{\{project-name\}\}/g, projectName);
      await fs.writeFile(pkgPath, pkgContent, 'utf8');
    }
  }
};
