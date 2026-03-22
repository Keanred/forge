type Template = 'react' | 'express' | 'fullstack';

interface ProjectConfig {
  name: string;
  template: Template;
  typescript: boolean;
  packageManager: 'npm' | 'yarn' | 'pnpm';
  git: boolean;
  version: string;
}
