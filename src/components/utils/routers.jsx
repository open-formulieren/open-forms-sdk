import {matchPath, resolvePath} from 'react-router';

/**
 * Check if a given relative path from the routes matches the current location.
 * @param currentPathname The current router location.pathname, from useLocation.
 * @param path            The relative path to check for matches
 */
export const checkMatchesPath = (currentPathname, path) => {
  // we need to transform the path into a parent-route lookup, instead of using the
  // default relative ./<foo> behaviour. The idea is that this component is mounted
  // somewhere in a larger route definition but the exact parent route is not relevant.
  const resolvedPath = resolvePath(`../${path}`, currentPathname);
  // if the relative path is not the current URL, matchPath returns null, otherwise
  // a match object.
  const match = matchPath(resolvedPath.pathname, currentPathname);
  return match !== null;
};
