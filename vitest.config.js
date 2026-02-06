module.exports = {
  test: {
    globals: true,
    include: ['tests/frontend/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/routeExpectations.js'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      }
    }
  }
};
