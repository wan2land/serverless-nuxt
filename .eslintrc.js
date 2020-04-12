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
        'graphity',
        'graphity/typescript',
      ],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
    {
      files: ['**/*.js'],
      extends: [
        'graphity',
      ],
      parserOptions: {
        ecmaVersion: 9,
      },
    },
  ],
}
