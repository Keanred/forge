import { describe, it, expect } from 'vitest';
import { ProjectConfig } from '../src/types';

describe('ProjectConfig Type', () => {
  it('should allow valid project config', () => {
    const config: ProjectConfig = {
      name: 'my-app',
      template: 'express',
      typescript: true,
      testing: false,
      packageManager: 'npm',
      git: true,
    };

    expect(config).toBeDefined();
    expect(config.name).toBe('my-app');
    expect(config.template).toBe('express');
  });

  it('should have all required fields', () => {
    const config: ProjectConfig = {
      name: 'test',
      template: 'react',
      typescript: true,
      testing: true,
      packageManager: 'yarn',
      git: false,
    };

    expect(config).toHaveProperty('name');
    expect(config).toHaveProperty('template');
    expect(config).toHaveProperty('typescript');
    expect(config).toHaveProperty('testing');
    expect(config).toHaveProperty('packageManager');
    expect(config).toHaveProperty('git');
  });

  it('should support all template types', () => {
    const templates: ProjectConfig['template'][] = ['express', 'react', 'express-react'];

    templates.forEach((template) => {
      const config: ProjectConfig = {
        name: 'app',
        template,
        typescript: true,
        testing: false,
        packageManager: 'npm',
        git: true,
      };

      expect(config.template).toBe(template);
    });
  });

  it('should support all package managers', () => {
    const packages: ProjectConfig['packageManager'][] = ['npm', 'yarn', 'pnpm'];

    packages.forEach((pm) => {
      const config: ProjectConfig = {
        name: 'app',
        template: 'react',
        typescript: true,
        testing: false,
        packageManager: pm,
        git: true,
      };

      expect(config.packageManager).toBe(pm);
    });
  });
});
