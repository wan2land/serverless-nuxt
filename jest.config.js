module.exports = {
  preset: 'ts-jest',
  testRegex: '[^/]*\\.test.(t|j)sx?$',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
}
