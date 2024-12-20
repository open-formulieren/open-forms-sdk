import type {StorybookConfig} from '@storybook/react-vite';

// https://github.com/storybookjs/storybook/issues/26291 vite-plugin-istanbul is
// still causing CommonJS warnings, which is because of @storybook/addon-coverage,
// see https://github.com/storybookjs/storybook/issues/26291#issuecomment-2378399131

const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-theme-provider',
    'storybook-react-intl',
    'storybook-addon-remix-react-router',
    '@storybook/addon-coverage',
    '@storybook/addon-webpack5-compiler-babel',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../src/img/', '../public'],
  docs: {},
};

export default config;
