/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'], // Look for tests in src/
  testMatch: ['**/__tests__/**/*.test.ts'], // Pattern for test files
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};