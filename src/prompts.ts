import inquirer from 'inquirer';
import { ProjectConfig } from './types';

export const promptUser = async (defaults: Partial<ProjectConfig>) => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      when: () => !defaults.name,
      default: defaults.name || 'my-project',
    },
    {
      type: 'list',
      name: 'template',
      message: 'Project template:',
      when: () => !defaults.template,
      choices: ['react', 'express', 'fullstack'],
      default: defaults.template || 'express',
    },
    {
      type: 'list',
      name: 'typescript',
      message: 'Use typescript?',
      when: () => !defaults.typescript,
      choices: ['Yes', 'No'],
      transformer: (input: string) => {
        return input === 'Yes' ? true : false;
      },
      default: defaults.typescript || 'Yes',
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Package manager:',
      when: () => !defaults.packageManager,
      choices: ['npm', 'yarn', 'pnpm'],
      default: defaults.packageManager || 'npm',
    },
    {
      type: 'confirm',
      name: 'git',
      when: () => !defaults.git,
      message: 'Initialize git repository?',
      default: defaults.git || true,
    },
  ]);
  return answers;
};
