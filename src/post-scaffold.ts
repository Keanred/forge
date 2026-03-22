import { execSync } from 'child_process';

export const initGit = () => {
  try {
    execSync('git init', { stdio: 'inherit' });
    console.log('Initialized a new Git repository.');
  } catch (error) {
    console.error('Failed to initialize Git repository:', error);
  }
};
