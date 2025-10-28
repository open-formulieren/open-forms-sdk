// https://vitejs.dev/config/
import {codecovVitePlugin} from '@codecov/vite-plugin';
import replace from '@rollup/plugin-replace';
import {sentryVitePlugin} from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import type {OutputOptions} from 'rollup';
import dts from 'vite-plugin-dts';
import eslint from 'vite-plugin-eslint2';
import tsconfigPaths from 'vite-tsconfig-paths';
import {coverageConfigDefaults, defineConfig} from 'vitest/config';

import {cjsTokens, ejsPlugin} from './build/plugins.mjs';
import {packageRegexes} from './build/utils.mjs';

// type definition for our custom envvars
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      BUILD_TARGET: 'umd' | 'esm' | 'esm-bundle' | undefined;
    }
  }
}

const buildTarget = process.env.BUILD_TARGET || 'umd';
const buildTargetDefined = process.env.BUILD_TARGET !== undefined;

const getOutput = (buildTarget: typeof process.env.BUILD_TARGET): OutputOptions => {
  switch (buildTarget) {
    case 'esm-bundle': {
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
    case 'esm': {
      /**
       * Rollup output options for ESM build, which is what we package in the NPM package
       * under the 'esm' subdirectory.
       *
       * The ESM package is experimental. Known issues:
       * @fixme
       *
       * - the react-intl translations are not distributed yet (also broken in CRA/babel build!)
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
    case 'umd':
    default: {
      /**
       * Rollup output options for UMD bundle, included in the NPM package but
       * the primary distribution mechanism is in a Docker image.
       *
       * @deprecated - it's better to use the ESM bundle which has separate chunks.
       */
      return {
        dir: `dist/bundles/`,
        format: 'umd',
        exports: 'named',
        name: 'OpenForms',
        generatedCode: 'es2015',
        entryFileNames: 'open-forms-sdk.js',
        assetFileNames: ({name}) => {
          if (name === 'style.css') {
            return 'open-forms-sdk.css';
          }
          return 'static/media/[name].[hash:8].[ext]';
        },
        inlineDynamicImports: true,
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
      // BIG DISCLAIMER - Vite only processes files with the .jsx or .tsx extension with
      // babel, and changing this configuration is... cumbersome and comes with a performance
      // penalty. This manifests if you're using react-intl in .js/.mjs/.ts files etc., as
      // they don't get transformed to inject the message ID. The solution is to rename the
      // file extension to .jsx/.tsx
      react({babel: {babelrc: true}}),
      tsconfigPaths(),
      eslint({
        build: true,
        emitErrorAsWarning: mode === 'development',
      }),
      cjsTokens(),
      ejsPlugin(),
      // @formio/protected-eval requires js-interpeter (a forked version), which includes
      // this['Interpreter'] = Interpreter. When this is bundled, it becomes a strict module
      // and 'this' doesn't point to the window object, but is undefined, and causes the SDK
      // to crash.
      replace({
        preventAssignment: false,
        include: ['**/node_modules/js-interpreter/interpreter.js'],
        delimiters: ['', ''],
        values: {
          "this\['Interpreter'\]": "window['Interpreter']",
        },
      }),
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
      /**
       * Plugin to ignore (S)CSS when bundling to UMD bundle target, since we use the ESM
       * bundle to generate these.
       *
       * @todo Remove this when we drop the UMD bundle entirely (in 4.0?)
       */
      {
        name: 'ignore-styles-esm-bundle',
        transform(code, id) {
          if (!buildTargetDefined) return;
          if (buildTarget === 'umd' && (id.endsWith('.css') || id.endsWith('scss'))) {
            // skip processing
            return {code: '', map: null};
          }
        },
      },
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
        // do not externalize anything in UMD build - bundle everything
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
          silenceDeprecations: ['import', 'mixed-decls'],
        },
      },
    },
    test: {
      server: {
        deps: {
          inline: ['@open-formulieren/formio-renderer'],
        },
      },
      environment: 'jsdom',
      environmentOptions: {
        jsdom: {
          url: 'http://localhost',
        },
      },
      globals: true, // for compatibility with jest
      // See https://vitest.dev/guide/migration.html#fake-timers-defaults
      fakeTimers: {
        toFake: ['setTimeout', 'clearTimeout', 'Date'],
      },
      setupFiles: ['./src/vitest.setup.mts'],
      coverage: {
        provider: 'istanbul',
        include: ['src/**/*.{js,jsx,ts,tsx}'],
        exclude: [
          'src/**/*.d.ts',
          'src/**/*.stories.{js,jsx,ts,tsx}',
          'src/api-mocks/*',
          'src/**/mocks.{js,jsx}',
          'src/story-utils/*',
          ...coverageConfigDefaults.exclude,
        ],
        reporter: ['text', 'cobertura', 'html'],
      },
    },
  };
});
