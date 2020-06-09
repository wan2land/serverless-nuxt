module.exports = {
  env: {
    jest: true,
  },
  ignorePatterns: [
    'node_modules/',
  ],
  overrides: [
    {
      files: ['**/*.ts'],
      extends: [
        'stable',
        'stable/typescript',
      ],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
    {
      files: ['**/*.js'],
      extends: [
        'stable',
      ],
      parserOptions: {
        ecmaVersion: 9,
      },
    },
  ],
}
