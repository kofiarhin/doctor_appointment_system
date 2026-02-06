module.exports = {
  testMatch: ['**/tests/backend/**/*.test.js'],
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/routeExpectations.js'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
