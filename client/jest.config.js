/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Use JSDOM for browser-like environment
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Path to setup file
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy', // Handle CSS imports in tests
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};