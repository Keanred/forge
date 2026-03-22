import { describe, it, expect } from 'vitest';
import { listTemplates, getTemplates } from '../../src/templates/registry';

describe('Template Registry', () => {
  describe('listTemplates', () => {
    it('should return all available templates', () => {
      const templates = listTemplates();

      expect(templates).toHaveLength(3);
      expect(templates.map((t) => t.name.toLowerCase())).toEqual([
        'express',
        'react',
        'express + react',
      ]);
    });

    it('should return templates with required fields', () => {
      const templates = listTemplates();

      templates.forEach((template) => {
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('description');
        expect(template).toHaveProperty('dirPath');
        expect(template).toHaveProperty('supportedOptions');
        expect(Array.isArray(template.supportedOptions)).toBe(true);
      });
    });

    it('should have unique template names', () => {
      const templates = listTemplates();
      const names = templates.map((t) => t.name);

      expect(new Set(names).size).toBe(names.length);
    });
  });

  describe('getTemplates', () => {
    it('should return express template', () => {
      const template = getTemplates('express');

      expect(template.name).toBe('Express');
      expect(template.dirPath).toBe('express');
      expect(template.supportedOptions).toContain('typescript');
      expect(template.supportedOptions).toContain('testing');
    });

    it('should return react template', () => {
      const template = getTemplates('react');

      expect(template.name).toBe('React');
      expect(template.dirPath).toBe('react');
    });

    it('should return express-react template', () => {
      const template = getTemplates('express-react');

      expect(template.name).toBe('Express + React');
      expect(template.dirPath).toBe('express-react');
    });

    it('should throw error for unknown template', () => {
      expect(() => getTemplates('unknown')).toThrow(/unknown template/i);
    });

    it('express template should support all options', () => {
      const template = getTemplates('express');

      expect(template.supportedOptions).toEqual([
        'typescript',
        'testing',
        'packageManager',
        'git',
      ]);
    });

    it('react template should support all options', () => {
      const template = getTemplates('react');

      expect(template.supportedOptions).toEqual([
        'typescript',
        'testing',
        'packageManager',
        'git',
      ]);
    });

    it('express-react template should support all options', () => {
      const template = getTemplates('express-react');

      expect(template.supportedOptions).toEqual([
        'typescript',
        'testing',
        'packageManager',
        'git',
      ]);
    });
  });

  describe('Template structure', () => {
    it('should have consistent dirPath format', () => {
      const templates = listTemplates();

      templates.forEach((template) => {
        expect(template.dirPath).toMatch(/^[\w-]+$/);
      });
    });

    it('should have descriptions for all templates', () => {
      const templates = listTemplates();

      templates.forEach((template) => {
        expect(template.description).toBeTruthy();
        expect(template.description.length).toBeGreaterThan(0);
      });
    });
  });
});
