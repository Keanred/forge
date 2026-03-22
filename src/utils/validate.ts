import fs from 'fs-extra';
import path from 'path';

const validateProjectName = async (projectName: string) => {
  // Check for spaces
  if (projectName.includes(' ')) {
    throw new Error('Project name cannot contain spaces.');
  }

  // Check if starts with dot or dash
  if (projectName.startsWith('.') || projectName.startsWith('-')) {
    throw new Error('Project name cannot start with a dot or dash.');
  }

  const validNameRegex = /^[a-zA-Z0-9-_]+$/;
  if (!validNameRegex.test(projectName)) {
    throw new Error('Invalid project name. Use only letters, numbers, hyphens, or underscores.');
  }
  const pathExists = await fs.pathExists(path.join(process.cwd(), projectName));
  if (pathExists) {
    throw new Error(`A directory named "${projectName}" already exists. Please choose a different name.`);
  }
};

export { validateProjectName };
