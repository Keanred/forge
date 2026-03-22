import { ProjectConfig } from 'types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PackageJson = Record<string, any>;

const generateExpressPackageJson = (config: ProjectConfig): PackageJson => {
  const { name, typescript, testing } = config;

  const scripts: Record<string, string> = {
    dev: 'tsx watch src/main.ts',
    ...(typescript ? { build: 'tsc' } : {}),
    lint: 'eslint .',
    start: 'node dist/main.js',
    ...(testing ? { test: 'vitest run', 'test:watch': 'vitest' } : {}),
  };

  const devDependencies: Record<string, string> = {
    ...(typescript
      ? {
          '@types/cors': '^2.8.17',
          '@types/express': '^5.0.0',
          '@types/node': '^22.0.0',
        }
      : {}),
    ...(typescript && testing ? { '@types/supertest': '^6.0.2' } : {}),
    eslint: '^9.17.0',
    'eslint-plugin-prettier': '^5.2.1',
    prettier: '^3.4.2',
    'prettier-plugin-organize-imports': '^4.1.0',
    ...(testing ? { supertest: '^7.0.0' } : {}),
    tsx: '^4.19.2',
    ...(typescript ? { typescript: '~5.7.2', 'typescript-eslint': '^8.18.2' } : {}),
    ...(testing ? { vitest: '^3.0.8' } : {}),
  };

  return {
    name,
    version: '1.0.0',
    main: 'dist/main.js',
    scripts,
    keywords: [],
    author: '',
    license: 'ISC',
    description: '',
    dependencies: {
      cors: '^2.8.6',
      express: '^5.2.1',
    },
    devDependencies,
  };
};

const generateReactPackageJson = (config: ProjectConfig): PackageJson => {
  const { name, typescript, testing } = config;

  const scripts: Record<string, string> = {
    dev: 'vite',
    build: typescript ? 'tsc -b && vite build' : 'vite build',
    lint: 'eslint .',
    preview: 'vite preview',
    ...(testing ? { test: 'vitest run', 'test:watch': 'vitest' } : {}),
  };

  const devDependencies: Record<string, string> = {
    '@eslint/js': '^9.17.0',
    ...(testing
      ? {
          '@testing-library/jest-dom': '^6.6.3',
          '@testing-library/react': '^16.2.0',
          '@testing-library/user-event': '^14.6.1',
        }
      : {}),
    ...(typescript
      ? {
          '@types/react': '^19.0.2',
          '@types/react-dom': '^19.0.2',
        }
      : {}),
    '@vitejs/plugin-react': '^4.3.4',
    eslint: '^9.17.0',
    'eslint-plugin-react-hooks': '^5.0.0',
    'eslint-plugin-react-refresh': '^0.4.16',
    ...(!typescript ? { globals: '^15.14.0' } : {}),
    ...(testing ? { jsdom: '^26.0.0' } : {}),
    ...(typescript ? { typescript: '~5.7.2', 'typescript-eslint': '^8.18.2' } : {}),
    vite: '^6.0.5',
    ...(testing ? { vitest: '^3.0.8' } : {}),
  };

  return {
    name,
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts,
    dependencies: {
      react: '^19.0.0',
      'react-dom': '^19.0.0',
    },
    devDependencies,
  };
};

const generateExpressReactPackageJson = (config: ProjectConfig): PackageJson => {
  const { name } = config;

  return {
    name,
    version: '1.0.0',
    workspaces: ['client', 'server'],
    scripts: {
      dev: 'npm-run-all --parallel dev:client dev:server',
      'dev:client': 'npm --workspace client run dev',
      'dev:server': 'npm --workspace server run dev',
    },
    keywords: [],
    author: '',
    license: 'ISC',
    description: '',
  };
};

export const generatePackageJson = (config: ProjectConfig): PackageJson => {
  switch (config.template.toLowerCase()) {
    case 'react':
      return generateReactPackageJson(config);
    case 'express-react':
      return generateExpressReactPackageJson(config);
    default:
      return generateExpressPackageJson(config);
  }
};
