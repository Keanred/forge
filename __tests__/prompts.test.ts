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
      typescript: 'Yes',
      packageManager: 'npm',
      git: true,
    });
    const answers = await promptUser({});
    expect(answers).toEqual({
      name: 'my-app',
      template: 'fullstack',
      typescript: 'Yes',
      packageManager: 'npm',
      git: true,
    });
    expect(mockedPrompt).toHaveBeenCalledTimes(1);
  });

  it('should skip prompts with defaults', async () => {
    mockedPrompt.mockResolvedValue({
      packageManager: 'yarn',
      git: false,
    });
    const defaults: Partial<ProjectConfig> = {
      name: 'preset',
      template: 'react',
      typescript: true,
    };
    const answers = await promptUser(defaults);
    expect(answers).toEqual({
      packageManager: 'yarn',
      git: false,
    });
    expect(mockedPrompt).toHaveBeenCalledTimes(1);
  });

  it('should use default values if provided', async () => {
    mockedPrompt.mockResolvedValue({
      name: 'default-app',
      template: 'express',
      typescript: 'No',
      packageManager: 'pnpm',
      git: true,
    });
    const defaults: Partial<ProjectConfig> = {
      name: 'default-app',
      template: 'express',
      typescript: false,
      packageManager: 'pnpm',
      git: true,
    };
    const answers = await promptUser(defaults);
    expect(answers).toEqual({
      name: 'default-app',
      template: 'express',
      typescript: 'No',
      packageManager: 'pnpm',
      git: true,
    });
  });
});
