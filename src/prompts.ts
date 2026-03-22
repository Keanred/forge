import inquirer from 'inquirer';
import { ProjectConfig } from './types';

const toBool = (value: unknown, fallback: boolean): boolean => (typeof value === 'boolean' ? value : fallback);

export const promptUser = async (defaults: any) => {
  const mappedDefaults: Partial<ProjectConfig> = {
    name: defaults.name,
    template: defaults.template,
    typescript: typeof defaults.typescript === 'boolean' ? defaults.typescript : undefined,
    testing: typeof defaults.testing === 'boolean' ? defaults.testing : undefined,
    packageManager: defaults.packageManager || defaults.pm,
    git: typeof defaults.git === 'boolean' ? defaults.git : undefined,
  };

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      when: () => !mappedDefaults.name,
      default: 'my-project',
    },
    {
      type: 'list',
      name: 'template',
      message: 'Project template:',
      when: () => !mappedDefaults.template,
      choices: ['react', 'express', 'fullstack'],
      default: 'express',
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Use typescript?',
      when: () => mappedDefaults.typescript === undefined,
      default: true,
    },
    {
      type: 'confirm',
      name: 'testing',
      message: 'Include testing setup?',
      when: () => mappedDefaults.testing === undefined,
      default: false,
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Package manager:',
      when: () => !mappedDefaults.packageManager,
      choices: ['npm', 'yarn', 'pnpm'],
      default: 'npm',
    },
    {
      type: 'confirm',
      name: 'git',
      when: () => mappedDefaults.git === undefined,
      message: 'Initialize git repository?',
      default: true,
    },
  ]);

  return {
    ...mappedDefaults,
    ...answers,
    typescript: toBool(answers.typescript ?? mappedDefaults.typescript, true),
    testing: toBool(answers.testing ?? mappedDefaults.testing, false),
    git: toBool(answers.git ?? mappedDefaults.git, true),
  };
};
