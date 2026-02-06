module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  collectCoverageFrom: ['controllers/**/*.js', 'models/**/*.js', 'routes/**/*.js', 'app.js']
};
