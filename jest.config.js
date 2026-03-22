/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  testPathIgnorePatterns: [
    '/dist/',
    '/node_modules/',
    '/src/templates/',
    '/templates/',
    '/src/templates/.*/package.json$',
    '/templates/.*/package.json$'
  ],
};
