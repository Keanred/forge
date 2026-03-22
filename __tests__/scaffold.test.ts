import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resolvePath } from '../src/scaffold';
import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'node:path';
import { ProjectConfig } from '../src/types';

vi.mock('fs-extra');
vi.mock('glob');

describe('Scaffold Engine', () => {
  const mockConfig: ProjectConfig = {
    name: 'test-app',
    template: 'express',
    typescript: true,
    testing: false,
    packageManager: 'npm',
    git: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fs.pathExists).mockResolvedValue(false);
    vi.mocked(fs.copy).mockResolvedValue(undefined);
    vi.mocked(fs.readJSON).mockResolvedValue({});
    vi.mocked(fs.writeJSON).mockResolvedValue(undefined);
    vi.mocked(fs.ensureDir).mockResolvedValue(undefined);
    vi.mocked(fs.remove).mockResolvedValue(undefined);
    vi.mocked(fs.readFile).mockResolvedValue('{}');
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    vi.mocked(glob).mockResolvedValue([]);
  });

  it('should throw error if name is missing', async () => {
    const config = { ...mockConfig, name: '' };

    await expect(resolvePath(config)).rejects.toThrow(/name is required/i);
  });

  it('should copy template directory', async () => {
    await resolvePath(mockConfig);

    expect(fs.copy).toHaveBeenCalled();
    const callArgs = vi.mocked(fs.copy).mock.calls[0];
    expect(callArgs[0]).toContain('express');
    expect(callArgs[1]).toContain('test-app');
  });

  it('should skip node_modules and .git directories during copy', async () => {
    await resolvePath(mockConfig);

    const filterFn = vi.mocked(fs.copy).mock.calls[0][2].filter;

    expect(filterFn('/path/node_modules/file')).toBe(false);
    expect(filterFn('/path/.git/config')).toBe(false);
    expect(filterFn('/path/src/main.ts')).toBe(true);
  });

  it('should write package.json using the generator', async () => {
    await resolvePath(mockConfig);

    expect(fs.writeJSON).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
      expect.objectContaining({ name: 'test-app' }),
      expect.any(Object),
    );
  });

  it('should add testing dependencies when testing enabled', async () => {
    const config = { ...mockConfig, template: 'express', testing: true };
    const packageJson = {
      devDependencies: {},
      scripts: {},
    };

    vi.mocked(fs.pathExists).mockResolvedValueOnce(true);
    vi.mocked(fs.readJSON).mockResolvedValueOnce(packageJson);

    await resolvePath(config);

    expect(fs.writeJSON).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
      expect.objectContaining({
        devDependencies: expect.objectContaining({
          vitest: expect.any(String),
          supertest: expect.any(String),
        }),
      }),
      expect.any(Object),
    );
  });

  it('should add React testing dependencies for react template', async () => {
    const config = { ...mockConfig, template: 'react', testing: true };
    const packageJson = {
      devDependencies: {},
      scripts: {},
    };

    vi.mocked(fs.pathExists).mockResolvedValueOnce(true);
    vi.mocked(fs.readJSON).mockResolvedValueOnce(packageJson);

    await resolvePath(config);

    expect(fs.writeJSON).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
      expect.objectContaining({
        devDependencies: expect.objectContaining({
          '@testing-library/react': expect.any(String),
          jsdom: expect.any(String),
        }),
      }),
      expect.any(Object),
    );
  });

  it('should create vitest.config.ts when testing enabled', async () => {
    const config = { ...mockConfig, testing: true };

    await resolvePath(config);

    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('vitest.config.ts'),
      expect.stringContaining('defineConfig'),
      'utf8',
    );
  });

  it('should create test setup file for react', async () => {
    const config = { ...mockConfig, template: 'react', testing: true };

    await resolvePath(config);

    expect(fs.ensureDir).toHaveBeenCalledWith(expect.stringContaining('src/test'));
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('setup.ts'),
      expect.stringContaining('@testing-library/jest-dom'),
      'utf8',
    );
  });

  it('should create tests directory for express', async () => {
    const config = { ...mockConfig, template: 'express', testing: true };

    await resolvePath(config);

    expect(fs.ensureDir).toHaveBeenCalledWith(expect.stringContaining('tests'));
  });

  it('should remove tsconfig.json when typescript disabled', async () => {
    const config = { ...mockConfig, typescript: false };
    vi.mocked(glob).mockResolvedValueOnce([]);
    vi.mocked(fs.pathExists).mockResolvedValueOnce(true); // template exists

    await resolvePath(config);

    expect(fs.remove).toHaveBeenCalledWith(expect.stringContaining('tsconfig.json'));
  });

  it('should remove eslint.config.ts when typescript disabled', async () => {
    const config = { ...mockConfig, typescript: false };
    vi.mocked(glob).mockResolvedValueOnce([]);
    vi.mocked(fs.pathExists).mockResolvedValueOnce(true); // template exists
    vi.mocked(fs.pathExists).mockResolvedValueOnce(true); // tsconfig exists
    vi.mocked(fs.pathExists).mockResolvedValueOnce(true); // eslint.config.ts exists

    await resolvePath(config);

    expect(fs.remove).toHaveBeenCalledWith(expect.stringContaining('eslint.config.ts'));
  });

  it('should rename .ts files to .js when typescript disabled', async () => {
    const config = { ...mockConfig, typescript: false };
    const tsFiles = ['/path/src/main.ts', '/path/src/routes/api.ts'];

    vi.mocked(glob).mockResolvedValueOnce(tsFiles);

    await resolvePath(config);

    expect(fs.rename).toHaveBeenCalledWith('/path/src/main.ts', '/path/src/main.js');
    expect(fs.rename).toHaveBeenCalledWith('/path/src/routes/api.ts', '/path/src/routes/api.js');
  });

  it('should rename .tsx files to .jsx when typescript disabled', async () => {
    const config = { ...mockConfig, template: 'react', typescript: false };
    const tsxFiles = ['/path/src/App.tsx', '/path/src/App.test.tsx'];

    vi.mocked(glob).mockResolvedValueOnce(tsxFiles);

    await resolvePath(config);

    expect(fs.rename).toHaveBeenCalledWith('/path/src/App.tsx', '/path/src/App.jsx');
    expect(fs.rename).toHaveBeenCalledWith('/path/src/App.test.tsx', '/path/src/App.test.jsx');
  });

  it('should add test scripts to package.json', async () => {
    const config = { ...mockConfig, testing: true };
    const packageJson = {
      devDependencies: {},
      scripts: { dev: 'vitest' },
    };

    vi.mocked(fs.pathExists).mockResolvedValueOnce(true);
    vi.mocked(fs.readJSON).mockResolvedValueOnce(packageJson);

    await resolvePath(config);

    expect(fs.writeJSON).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        scripts: expect.objectContaining({
          test: 'vitest run',
          'test:watch': 'vitest',
        }),
      }),
      expect.any(Object),
    );
  });

  it('should handle case-insensitive template names', async () => {
    const config = { ...mockConfig, template: 'EXPRESS' as unknown as ProjectConfig['template'] };

    await resolvePath(config);

    expect(fs.copy).toHaveBeenCalled();
  });
});
