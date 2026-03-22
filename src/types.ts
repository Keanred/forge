type Template = 'react' | 'express' | 'fullstack';
type PackageManager = 'npm' | 'yarn' | 'pnpm';

export interface ProjectConfig {
  name: string;
  template: Template;
  typescript: boolean;
  testing: boolean;
  packageManager: PackageManager;
  git: boolean;
}
