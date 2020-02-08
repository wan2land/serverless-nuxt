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
        '@stdjs',
        '@stdjs/eslint-config/typescript',
      ],
      rules: {
        'import/no-unresolved': 'off',
      },
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
    {
      files: ['**/*.js'],
      extends: [
        '@stdjs',
      ],
      parserOptions: {
        ecmaVersion: 9,
      },
    },
  ],
}
