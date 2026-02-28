module.exports = {
  preset: 'detox/jest-preset',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./e2e/setup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
};
