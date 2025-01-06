import globals from 'globals';
import { ignoreBuildArtifacts } from "@maykinmedia/eslint-config";
import recommended from "@maykinmedia/eslint-config/recommended";

const config = [
  ignoreBuildArtifacts(["dist", "dist-vite", "storybook-static"]),
  ...recommended,
  {
    name: 'project/overrides',
    rules: {
      // normally this would be on, but we'll rather migrate to typescript
      'react/prop-types': 'off',
    }
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
