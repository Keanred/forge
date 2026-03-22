import { execSync } from 'child_process';

export const initGit = (dir: string) => {
  try {
    execSync('git init', { stdio: 'inherit', cwd: dir });
    console.log('Initialized a new Git repository.');
  } catch (error) {
    console.error('Failed to initialize Git repository:', error);
  }
};
