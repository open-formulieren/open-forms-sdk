// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest/config" />
import {codecovVitePlugin} from '@codecov/vite-plugin';
import {sentryVitePlugin} from '@sentry/vite-plugin';
import {storybookTest} from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import {playwright} from '@vitest/browser-playwright';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import path from 'path';
import type {OutputOptions} from 'rollup';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';
import eslint from 'vite-plugin-eslint2';
import tsconfigPaths from 'vite-tsconfig-paths';
import {coverageConfigDefaults} from 'vitest/config';

import {cjsTokens} from './build/plugins.mjs';
import {packageRegexes} from './build/utils.mjs';

// type definition for our custom envvars
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      BUILD_TARGET: 'esm' | 'esm-bundle' | undefined;
    }
  }
}

const _OF_INTERNAL_dirname = dirname(fileURLToPath(import.meta.url));

const buildTarget = process.env.BUILD_TARGET || 'esm-bundle';

const getOutput = (buildTarget: typeof process.env.BUILD_TARGET): OutputOptions => {
  switch (buildTarget) {
    case 'esm': {
      /**
       * Rollup output options for ESM build, which is what we package in the NPM package
       * under the 'esm' subdirectory.
       */
      return {
        dir: 'dist/',
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: ({name}) => {
          if (name?.endsWith('.css')) {
            return '[name].[ext]';
          }
          return 'static/media/[name].[hash:8].[ext]';
        },
      } satisfies OutputOptions;
    }
    // esm-bundle is the default, and it's what gets emitted into the docker image
    case 'esm-bundle':
    default: {
      return {
        dir: `dist/bundles/`,
        format: 'esm',
        preserveModules: false,
        entryFileNames: 'open-forms-sdk.mjs',
        assetFileNames: ({name}) => {
          if (name === 'style.css') {
            return 'open-forms-sdk.css';
          }
          return 'static/media/[name].[hash:8].[ext]';
        },
        inlineDynamicImports: false,
      } satisfies OutputOptions;
    }
  }
};

export default defineConfig(({mode}) => {
  return {
    base: './',
    publicDir: false,
    server: {
      port: 3000,
    },
    plugins: [
      // BIG DISCLAIMER - Vite only processes files with the .tsx extension with
      // babel, and changing this configuration is... cumbersome and comes with a performance
      // penalty. This manifests if you're using react-intl in .(m)ts files etc., as
      // they don't get transformed to inject the message ID. The solution is to rename the
      // file extension to .tsx
      react({babel: {babelrc: true}}),
      tsconfigPaths(),
      eslint({
        build: true,
        emitErrorAsWarning: mode === 'development',
      }),
      cjsTokens(),
      buildTarget === 'esm'
        ? dts({tsconfigPath: './tsconfig.prod.json'})
        : dts({
            include: [
              'src/sdk.tsx',
              'src/hooks/usePageViews.ts',
              'src/data/forms.ts',
              'src/type-fixes.d.ts',
            ],
            rollupTypes: true,
            outDir: `dist/bundles`,
          }),
      sentryVitePlugin({
        silent: mode === 'development',
        release: {
          create: false,
          inject: false,
        },
        sourcemaps: {
          disable: true,
        },
        bundleSizeOptimizations: {
          excludeDebugStatements: true,
          excludeTracing: true,
          excludeReplayCanvas: true,
          excludeReplayShadowDom: true,
          excludeReplayIframe: true,
          excludeReplayWorker: true,
        },
        telemetry: false,
      }),
      // must be last!
      codecovVitePlugin({
        enableBundleAnalysis: buildTarget !== 'esm' && process.env.CODECOV_TOKEN !== undefined,
        bundleName: '@open-formulieren/sdk',
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
    resolve: {
      alias: {
        // ensure react-router imports don't end up with multiple copies/installations. See
        // https://github.com/remix-run/react-router/issues/12785 for more context.
        'react-router/dom': path.resolve(
          './node_modules/react-router/dist/development/dom-export.mjs'
        ),
        'react-router': path.resolve('./node_modules/react-router/dist/development/index.mjs'),
      },
    },
    build: {
      target: 'modules', // the default
      assetsInlineLimit: 8 * 1024, // 8 KiB
      cssCodeSplit: false,
      sourcemap: buildTarget !== 'esm',
      outDir: 'dist',
      // we write the .mjs file to the same directory
      emptyOutDir: buildTarget !== 'esm-bundle',
      rollupOptions: {
        input: 'src/sdk.tsx',
        // do not externalize anything in bundle build - bundle everything
        external: buildTarget === 'esm' ? packageRegexes : undefined,
        output: getOutput(buildTarget),
        preserveEntrySignatures: 'strict',
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$fa-font-path: '@fortawesome/fontawesome-free/webfonts/';`,
          charset: false,
          quietDeps: true,
          api: 'modern',
          silenceDeprecations: ['import', 'mixed-decls'],
        },
      },
    },
    test: {
      environment: 'node',

      server: {
        deps: {
          inline: ['@open-formulieren/formio-renderer'],
        },
      },
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.d.ts',
          'src/**/*.stories.{ts,tsx}',
          'src/api-mocks/*',
          'src/**/mocks.ts',
          'src/story-utils/*',
          ...coverageConfigDefaults.exclude,
        ],
        reporter: ['text', 'cobertura', 'html'],
      },
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({}),
        instances: [
          {
            browser: 'chromium',
            viewport: {
              width: 800,
              height: 600,
            },
          },
        ],
      },
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            setupFiles: ['./vitest-unit.setup.ts'],
            include: ['src/**/*.spec.{ts,tsx}'],
          },
        },
        {
          extends: true,
          plugins: [
            // The plugin will run tests for the stories defined in your Storybook config
            // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
            storybookTest({configDir: resolve(_OF_INTERNAL_dirname, '.storybook')}),
          ],
          test: {
            name: 'storybook',
            setupFiles: ['./vitest-storybook.setup.ts'],
          },
        },
      ],
    },
  };
});
