module.exports = {
  testEnvironment: 'node',

  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],

  collectCoverageFrom: [
    'routes/**/*.js',
    'server.js',
    '!node_modules/**'
  ],

  verbose: true
};
