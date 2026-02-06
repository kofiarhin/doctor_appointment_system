module.exports = {
  test: {
    globals: true,
    include: ['tests/frontend/**/*.test.js'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/routeExpectations.js', 'src/components/AppHeader.js'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      }
    }
  }
};
