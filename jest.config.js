module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/server/tests/**/*.test.js'],
  collectCoverageFrom: ['server/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  setupFilesAfterEnv: ['<rootDir>/server/tests/setup.js']
};
