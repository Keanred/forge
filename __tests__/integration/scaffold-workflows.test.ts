import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resolvePath } from '../../src/scaffold';
import { ProjectConfig } from '../../src/types';
import fs from 'fs-extra';
import { glob } from 'glob';

vi.mock('fs-extra');
vi.mock('glob');

describe('Scaffold Workflows (Integration)', () => {
  const setupMocks = () => {
    vi.resetAllMocks();
    vi.mocked(fs.pathExists).mockResolvedValue(false);
    vi.mocked(fs.copy).mockResolvedValue(undefined);
    vi.mocked(fs.readJSON).mockResolvedValue({
      devDependencies: {},
      scripts: {},
    });
    vi.mocked(fs.writeJSON).mockResolvedValue(undefined);
    vi.mocked(fs.ensureDir).mockResolvedValue(undefined);
    vi.mocked(fs.remove).mockResolvedValue(undefined);
    vi.mocked(fs.readFile).mockResolvedValue('{}');
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    vi.mocked(glob).mockResolvedValue([]);
  };

  describe('TypeScript + Testing Workflow', () => {
    it('should scaffold express with TypeScript and testing', async () => {
      setupMocks();

      const config: ProjectConfig = {
        name: 'api-app',
        template: 'express',
        typescript: true,
        testing: true,
        packageManager: 'npm',
        git: true,
      };

      await resolvePath(config);

      // Should copy template
      expect(fs.copy).toHaveBeenCalled();

      // Should create vitest config
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('vitest.config.ts'),
        expect.any(String),
        'utf8',
      );

      // Should create tests directory
      expect(fs.ensureDir).toHaveBeenCalledWith(expect.stringContaining('tests'));

      // Should add test dependencies
      expect(fs.writeJSON).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          devDependencies: expect.objectContaining({
            vitest: expect.any(String),
            supertest: expect.any(String),
          }),
        }),
        expect.any(Object),
      );

      // Should NOT remove config files
      expect(fs.remove).not.toHaveBeenCalledWith(expect.stringContaining('tsconfig'));
      expect(fs.remove).not.toHaveBeenCalledWith(expect.stringContaining('eslint.config'));
    });

    it('should scaffold react with TypeScript and testing', async () => {
      setupMocks();

      const config: ProjectConfig = {
        name: 'web-app',
        template: 'react',
        typescript: true,
        testing: true,
        packageManager: 'yarn',
        git: true,
      };

      await resolvePath(config);

      // Should create vitest config
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('vitest.config.ts'),
        expect.stringContaining('jsdom'),
        'utf8',
      );

      // Should create test setup file
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('setup.ts'),
        expect.any(String),
        'utf8',
      );

      // Should add React testing dependencies
      expect(fs.writeJSON).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          devDependencies: expect.objectContaining({
            '@testing-library/react': expect.any(String),
            jsdom: expect.any(String),
          }),
        }),
        expect.any(Object),
      );
    });
  });

  describe('JavaScript (no TypeScript) Workflow', () => {
    it('should scaffold express without TypeScript', async () => {
      setupMocks();
      const tsFiles = [
        '/path/src/main.ts',
        '/path/src/routes/api.ts',
        '/path/eslint.config.ts',
      ];
      vi.mocked(glob).mockResolvedValueOnce(tsFiles);
      
      // Mock fs.pathExists to return true for config files that should be removed
      vi.mocked(fs.pathExists)
        .mockResolvedValueOnce(true)  // tsconfig.json exists
        .mockResolvedValueOnce(true)  // eslint.config.ts exists
        .mockResolvedValueOnce(false); // eslint.config.js doesn't exist

      const config: ProjectConfig = {
        name: 'js-api',
        template: 'express',
        typescript: false,
        testing: false,
        packageManager: 'npm',
        git: false,
      };

      await resolvePath(config);

      // Should remove TypeScript config files
      expect(fs.remove).toHaveBeenCalledWith(expect.stringContaining('tsconfig.json'));
      expect(fs.remove).toHaveBeenCalledWith(expect.stringContaining('eslint.config.ts'));

      // Should rename .ts files to .js
      expect(fs.rename).toHaveBeenCalledWith(
        '/path/src/main.ts',
        '/path/src/main.js',
      );
      expect(fs.rename).toHaveBeenCalledWith(
        '/path/src/routes/api.ts',
        '/path/src/routes/api.js',
      );
    });

    it('should scaffold react without TypeScript', async () => {
      setupMocks();
      const files = [
        '/path/src/App.tsx',
        '/path/src/main.tsx',
        '/path/eslint.config.ts',
      ];
      vi.mocked(glob).mockResolvedValueOnce(files);
      
      // Mock fs.pathExists to return true for config files that should be removed
      vi.mocked(fs.pathExists)
        .mockResolvedValueOnce(true)  // tsconfig.json exists
        .mockResolvedValueOnce(true)  // eslint.config.ts exists
        .mockResolvedValueOnce(true);  // eslint.config.js exists (React template has this)

      const config: ProjectConfig = {
        name: 'js-web',
        template: 'react',
        typescript: false,
        testing: false,
        packageManager: 'pnpm',
        git: false,
      };

      await resolvePath(config);

      // Should remove TypeScript config files
      expect(fs.remove).toHaveBeenCalledWith(expect.stringContaining('tsconfig.json'));
      expect(fs.remove).toHaveBeenCalledWith(expect.stringContaining('eslint.config.ts'));

      // Should rename .tsx files to .jsx
      expect(fs.rename).toHaveBeenCalledWith(
        '/path/src/App.tsx',
        '/path/src/App.jsx',
      );
      expect(fs.rename).toHaveBeenCalledWith(
        '/path/src/main.tsx',
        '/path/src/main.jsx',
      );
    });
  });

  describe('No Testing Workflow', () => {
    it('should not add testing dependencies when disabled', async () => {
      setupMocks();

      const config: ProjectConfig = {
        name: 'simple-app',
        template: 'express',
        typescript: true,
        testing: false,
        packageManager: 'npm',
        git: true,
      };

      await resolvePath(config);

      // Should NOT create vitest config
      expect(fs.writeFile).not.toHaveBeenCalledWith(
        expect.stringContaining('vitest.config.ts'),
        expect.any(String),
        expect.any(String),
      );

      // Should NOT create tests directory
      expect(fs.ensureDir).not.toHaveBeenCalledWith(expect.stringContaining('tests'));
    });
  });

  describe('Fullstack Template', () => {
    it('should scaffold express-react fullstack template', async () => {
      setupMocks();

      const config: ProjectConfig = {
        name: 'my-fullstack',
        template: 'express-react',
        typescript: true,
        testing: true,
        packageManager: 'npm',
        git: true,
      };

      await resolvePath(config);

      // Should copy the fullstack template
      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining('express-react'),
        expect.stringContaining('my-fullstack'),
        expect.any(Object),
      );
    });
  });

  describe('Package Manager Handling', () => {
    it('should accept all package managers', async () => {
      const managers: ProjectConfig['packageManager'][] = ['npm', 'yarn', 'pnpm'];

      for (const pm of managers) {
        setupMocks();

        const config: ProjectConfig = {
          name: 'test-app',
          template: 'express',
          typescript: true,
          testing: false,
          packageManager: pm,
          git: false,
        };

        await resolvePath(config);

        expect(fs.copy).toHaveBeenCalled();
      }
    });
  });
});
