module.exports = {
  setupFiles: ['<rootDir>/node_modules/regenerator-runtime/runtime'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?)$',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  }
};
