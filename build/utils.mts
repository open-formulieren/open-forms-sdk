import {dependencies, peerDependencies} from '../package.json';

const externalPackages = [
  ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
  'formiojs',
  'lodash',
  '@formio/vanilla-text-mask',
  '@babel/runtime',
  '@utrecht/component-library-react',
];

// Creating regexes of the packages to make sure subpaths of the
// packages are also treated as external
export const packageRegexes = externalPackages.map(packageName => new RegExp(`^${packageName}(/.*)?`));
