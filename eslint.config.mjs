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
  // default exports for stories meta is idiomatic
  {
    files: ['src/**/*.stories.{ts,tsx}'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
  // Unit tests
  {
    files: ['**/*.spec.{ts,tsx}', './vitest-*.setup.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.vitest,
      },
    },
  },
]);

export default config;
