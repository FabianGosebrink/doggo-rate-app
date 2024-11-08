const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  coverageReporters: ['lcov', 'html', 'cobertura', 'text-summary', 'json'],
};
