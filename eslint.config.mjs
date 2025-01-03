import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

const config = [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals.browser,
      },
    },
  },
  // Standard JS rules
  pluginJs.configs.recommended,
  // Import/export linting
  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.mjs', '.json'],
          moduleDirectory: ['src', 'node_modules'],
        },
      },
    },
    ...importPlugin.flatConfigs.recommended,
    languageOptions: {
      ...importPlugin.flatConfigs.recommended.languageOptions,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      ...importPlugin.flatConfigs.recommended.rules,
      'import/first': 'error',
      'import/no-amd': 'error',
      'import/no-anonymous-default-export': 'warn',
      'import/no-webpack-loader-syntax': 'error',
    },
  },
  // React-specific linting
  jsxA11y.flatConfigs.recommended,
  {
    ...reactPlugin.configs.flat.recommended,
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      'react/jsx-uses-vars': 'warn',
      'react/jsx-uses-react': 'warn',
      // required for react-intl
      'react/style-prop-object': [
        'error',
        {
          allow: ['FormattedNumber', 'FormattedDateParts', 'FormattedRelativeTime'],
        },
      ],
      // normally this would be on, but we'll rather migrate to typescript
      'react/prop-types': 'off',
    },
  },
  reactPlugin.configs.flat['jsx-runtime'],
  {
    plugins: {'react-hooks': hooksPlugin},
    rules: hooksPlugin.configs.recommended.rules,
  },
  // Storybook stories
  {
    files: ['**/*.stories.{js,jsx}'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
  // Unit tests
  {
    files: ['**/*.spec.{js,jsx}', 'src/vitest.setup.mjs'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.vitest,
      },
    },
  },
];

export default config;
