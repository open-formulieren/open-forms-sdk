const _ = require('lodash');
const configFactory = require('../config/webpack.config');

// from ../config/webpack.config
const sassRegex = /\.(scss|sass)$/;

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  "webpackFinal": async (sbConfig, { configType }) => {
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
    const mergedRules = [sassRule, ...sbConfig.module.rules];
    return {
      ...sbConfig,
      resolve: mergedResolve,
      module: {
        ...sbConfig.module,
        rules: mergedRules,
      }
    };
  }
}
