const _ = require('lodash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const configFactory = require('../config/webpack.config');

// from ../config/webpack.config
const sassRegex = /\.(scss|sass)$/;
const config = {
  core: {
    disableTelemetry: true,
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-themes',
    'storybook-react-intl',
    'storybook-addon-remix-react-router',
    '@storybook/addon-coverage',
    '@storybook/addon-webpack5-compiler-babel',
  ],
  features: {
    interactionsDebugger: true,
    buildStoriesJson: true,
  },

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: ['../src/img/', '../public'],
  webpackFinal: async (sbConfig, {configType}) => {
    // configType is DEVELOPMENT or PRODUCTION
    const craConfig = configFactory(configType.toLowerCase());
    const mergedResolve = {
      ...sbConfig.resolve,
      extensions: _.uniq([...sbConfig.resolve.extensions, ...craConfig.resolve.extensions]),
      modules: _.uniq([...sbConfig.resolve.modules, ...craConfig.resolve.modules]),
      alias: {
        ...sbConfig.resolve.alias,
        ...craConfig.resolve.alias,
      },
      fallback: {
        ...sbConfig.resolve.fallback,
        ...craConfig.resolve.fallback,
      },
      // plugins: craConfig.resolve.plugins, -> this breaks the build as it adds the ModuleScopePlugin
      symlinks: craConfig.resolve.symlinks,
    };

    // add sass-loader etc.
    const oneOfRule = craConfig.module.rules.find(rule => rule.oneOf != null);
    const sassRule = oneOfRule.oneOf.find(rule => String(rule.test) === String(sassRegex));
    const ejsLoader = oneOfRule.oneOf.find(rule => rule.loader === 'ejs-loader');
    const mergedRules = [
      sassRule,
      {
        ...ejsLoader,
        // Exclude Storybook internal .ejs templates
        test: /formio.*\.ejs$/,
      },
      ...sbConfig.module.rules,
    ];
    const mergedPlugins = [...sbConfig.plugins];
    if (configType === 'PRODUCTION') {
      // from ../config/webpack.config
      mergedPlugins.push(
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: '[name].css',
        })
      );
    }
    const watchOptions = {
      ...sbConfig.watchOptions,
      // DO watch our own packages, especially useful when rebuilding the design-tokens
      ignored: /node_modules\/(?!@open-formulieren)/,
    };
    return {
      ...sbConfig,
      resolve: mergedResolve,
      module: {
        ...sbConfig.module,
        rules: mergedRules,
      },
      plugins: mergedPlugins,
      watchOptions,
    };
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
