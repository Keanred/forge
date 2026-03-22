import { ProjectConfig } from 'types';

export interface TemplateContext {
  PROJECT_NAME: string;
  AUTHOR: string;
  YEAR: string;
  NODE_VERSION: string;
  TYPESCRIPT: boolean;
  TESTING: boolean;
  [key: string]: string | boolean;
}

export const buildContext = (config: ProjectConfig): TemplateContext => ({
  PROJECT_NAME: config.name,
  AUTHOR: '',
  YEAR: new Date().getFullYear().toString(),
  NODE_VERSION: process.versions.node.split('.')[0],
  TYPESCRIPT: config.typescript,
  TESTING: config.testing,
});

export const renderTemplate = (content: string, context: TemplateContext): string => {
  // Process {{#if CONDITION}}...{{/if}} blocks before variable replacement
  let result = content.replace(
    /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_match, condition: string, block: string) => {
      return context[condition] ? block : '';
    },
  );

  // Replace {{VAR}} placeholders with context values
  result = result.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const val = context[key];
    if (val === undefined || typeof val === 'boolean') return '';
    return val;
  });

  return result;
};
