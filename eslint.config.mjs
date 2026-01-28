import {ignoreBuildArtifacts} from '@maykinmedia/eslint-config';
import recommended from '@maykinmedia/eslint-config/recommended';
import {defineConfig} from 'eslint/config';
import globals from 'globals';

const config = defineConfig([
  ignoreBuildArtifacts(['dist', 'dist-vite', 'storybook-static']),
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
  },
  ...recommended,
  {
    name: 'project/overrides',
    rules: {
      // normally this would be on, but we'll rather migrate to typescript
      'react/prop-types': 'off',
      // let's test-drive it before adding it to our maykin recommended
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          // the utrecht-button variants have some accessibility issues, use the wrappers
          // instead
          paths: [
            {
              name: '@utrecht/component-library-react',
              importNames: [
                'PrimaryActionButton',
                'Button',
                'SecondaryActionButton',
                'SubtleButton',
              ],
              message: 'Use Button (variants) from `@open-formulieren/formio-renderer` instead.',
            },
            {
              name: '@/components/Button',
              message: 'Use Button (variants) from `@open-formulieren/formio-renderer` instead.',
            },
          ],
        },
      ],
    },
  },
  // Only allow JSX? in specific places, otherwise TS must be used.
  {
    files: ['src/**/*.{js,jsx}'],
    ignores: [
      'src/formio/**/*.{js,jsx}',
      'src/jstests/formio/**/*.{js,jsx}',
      'src/formio-init.js',
      'src/components/FormStep/index.jsx',
      'src/components/FormStep/data.js',
      'src/components/FormStep/FormStep.stories.jsx',
    ],
    rules: {
      'no-restricted-syntax': ['error', {selector: 'Program', message: 'You must use Typescript.'}],
    },
  },
  // default exports for stories meta is idiomatic
  {
    files: ['src/**/*.stories.{js,jsx}'],
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
]);

export default config;
