import prettier from 'eslint-plugin-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));
const projectTsconfigs = [
  './server/tsconfig.json',
  './server/tsconfig.node.json',
  './client/tsconfig.json',
  './client/tsconfig.node.json',
  './schemas/tsconfig.json',
];

export default defineConfig([
  globalIgnores(['**/*.js', 'node_modules', '**/dist/**', '**/coverage/**']),
  {
    files: ['server/**/*.ts', 'client/**/*.ts', 'client/**/*.tsx', 'schemas/**/*.ts'],
    plugins: {
      prettier,
    },
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        project: projectTsconfigs,
        tsconfigRootDir,
        sourceType: 'module',
      },
      globals: {
        NodeJS: true,
      },
    },
    rules: {
      'max-len': ['warn', { code: 120 }],
      'prettier/prettier': 'error',
      eqeqeq: 'error',
      complexity: ['warn', 7],
      'no-case-declarations': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_.*' }],
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      'no-duplicate-imports': 'error',
      'no-nested-ternary': 'error',
      'no-use-before-define': 'warn',
      'func-style': ['warn', 'declaration', { allowArrowFunctions: true }],
      'prefer-arrow-callback': 'warn',
      'no-delete-var': 'error',
      'no-empty-function': 'error',
      'no-empty-pattern': 'error',
      'no-fallthrough': 'error',
      'no-global-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-octal': 'error',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
      'no-self-assign': 'error',
      'no-shadow-restricted-names': 'error',
      'no-unused-labels': 'error',
      'no-useless-catch': 'error',
      'no-useless-escape': 'error',
      'no-with': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);
