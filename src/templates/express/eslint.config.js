import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['node_modules', 'dist'] },
  {
    files: ['**/*.js'],
    plugins: {
      prettier,
    },
    extends: [js.configs.recommended],
    languageOptions: {
      sourceType: 'module',
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
      'no-redeclare': 'error',
      'no-self-assign': 'error',
      'no-shadow-restricted-names': 'error',
      'no-unused-labels': 'error',
      'no-useless-catch': 'error',
      'no-useless-escape': 'error',
      'no-with': 'error',
    },
  },
]);
