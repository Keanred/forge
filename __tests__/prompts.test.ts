
import { promptUser } from '../src/prompts';
import inquirer from 'inquirer';
import { ProjectConfig } from '../src/types';

jest.mock('inquirer');
const mockedPrompt = inquirer.prompt as unknown as jest.Mock;

describe('promptUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should prompt for all fields if no defaults', async () => {
    mockedPrompt.mockResolvedValue({
      name: 'my-app',
      template: 'fullstack',
      typescript: true,
      testing: true,
      packageManager: 'npm',
      git: true,
    });
    const answers = await promptUser({});
    expect(answers).toEqual({
      name: 'my-app',
      template: 'fullstack',
      typescript: true,
      testing: true,
      packageManager: 'npm',
      git: true,
    });
    expect(mockedPrompt).toHaveBeenCalledTimes(1);
  });

  it('should skip prompts with all defaults', async () => {
    mockedPrompt.mockResolvedValue({});
    const defaults: Partial<ProjectConfig> = {
      name: 'preset',
      template: 'react',
      typescript: true,
      testing: false,
      packageManager: 'yarn',
      git: false,
    };
    const answers = await promptUser(defaults);
    expect(answers).toEqual({
      name: 'preset',
      template: 'react',
      typescript: true,
      testing: false,
      packageManager: 'yarn',
      git: false,
    });
    expect(mockedPrompt).toHaveBeenCalledTimes(1);
  });

  it('should prompt only for missing fields', async () => {
    mockedPrompt.mockResolvedValue({
      testing: true,
      packageManager: 'pnpm',
    });
    const defaults: Partial<ProjectConfig> = {
      name: 'partial',
      template: 'express',
      typescript: false,
      git: true,
    };
    const answers = await promptUser(defaults);
    expect(answers).toEqual({
      name: 'partial',
      template: 'express',
      typescript: false,
      git: true,
      testing: true,
      packageManager: 'pnpm',
    });
    expect(mockedPrompt).toHaveBeenCalledTimes(1);
  });

  it('should merge CLI options and prompt answers, prompt answers take precedence', async () => {
    mockedPrompt.mockResolvedValue({
      name: 'prompt-app',
      typescript: false,
      testing: true,
    });
    const cliOpts = {
      name: 'cli-app',
      template: 'react',
      typescript: true,
      testing: false,
      packageManager: 'npm',
      git: true,
    };
    const answers = await promptUser(cliOpts);
    expect(answers).toEqual({
      name: 'prompt-app',
      template: 'react',
      typescript: false,
      testing: true,
      packageManager: 'npm',
      git: true,
    });
  });

  it('should handle boolean and string values for typescript and testing', async () => {
    mockedPrompt.mockResolvedValue({
      typescript: false,
      testing: true,
    });
    const defaults = {
      name: 'bool-app',
      template: 'fullstack',
      typescript: 'Yes', // simulate string input
      testing: 'No',     // simulate string input
      packageManager: 'yarn',
      git: false,
    };
    const answers = await promptUser(defaults);
    expect(answers).toEqual({
      name: 'bool-app',
      template: 'fullstack',
      typescript: false,
      testing: true,
      packageManager: 'yarn',
      git: false,
    });
  });

  it('should use default values for missing booleans', async () => {
    mockedPrompt.mockResolvedValue({});
    const defaults = {
      name: 'default-bool',
      template: 'express',
      packageManager: 'npm',
    };
    const answers = await promptUser(defaults);
    expect(answers).toMatchObject({
      name: 'default-bool',
      template: 'express',
      packageManager: 'npm',
      typescript: true, // default in prompt
      testing: false,   // default in prompt
    });
  });

  it('should prompt for name if not provided', async () => {
    mockedPrompt.mockResolvedValue({
      name: 'prompted-name',
      template: 'react',
      typescript: true,
      testing: false,
      packageManager: 'npm',
      git: true,
    });
    const answers = await promptUser({ template: 'react' });
    expect(answers.name).toBe('prompted-name');
    expect(answers.template).toBe('react');
  });

  it('should prompt for template if not provided', async () => {
    mockedPrompt.mockResolvedValue({
      name: 'my-app',
      template: 'fullstack',
      typescript: true,
      testing: false,
      packageManager: 'npm',
      git: true,
    });
    const answers = await promptUser({ name: 'my-app' });
    expect(answers.template).toBe('fullstack');
    expect(answers.name).toBe('my-app');
  });

  it('should prompt for packageManager if not provided', async () => {
    mockedPrompt.mockResolvedValue({
      packageManager: 'pnpm',
    });
    const answers = await promptUser({ name: 'my-app', template: 'react' });
    expect(answers.packageManager).toBe('pnpm');
  });

  it('should prompt for git if not provided', async () => {
    mockedPrompt.mockResolvedValue({
      git: false,
    });
    const answers = await promptUser({ name: 'my-app', template: 'react', packageManager: 'npm' });
    expect(answers.git).toBe(false);
  });

  it('should prompt for typescript if not provided', async () => {
    mockedPrompt.mockResolvedValue({
      typescript: false,
    });
    const answers = await promptUser({ name: 'my-app', template: 'react', packageManager: 'npm', git: true });
    expect(answers.typescript).toBe(false);
  });

  it('should prompt for testing if not provided', async () => {
    mockedPrompt.mockResolvedValue({
      testing: true,
    });
    const answers = await promptUser({ name: 'my-app', template: 'react', packageManager: 'npm', git: true, typescript: true });
    expect(answers.testing).toBe(true);
  });
});
