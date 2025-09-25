module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
        alwaysTryTypes: true,
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'import/extensions': 'off',
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'no-underscore-dangle': ['error', { allow: ['__dirname', '__filename'] }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.{js,jsx,ts,tsx}',
          '**/*.spec.{js,jsx,ts,tsx}',
          'vite.config.ts',
          '**/*.stories.*',
          '**/*.config.*',
        ],
        optionalDependencies: false,
        peerDependencies: false,
        includeTypes: true,
        packageDir: ['./', './src'],
      },
    ],
  },
  overrides: [
    {
      files: ['vite.config.ts'],
      rules: {
        'import/no-unresolved': 'off',
      },
    },
    {
      files: ['src/**/*.{js,jsx,ts,tsx}'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
