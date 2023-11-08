import {matchPath} from 'react-router-dom';

/**
 * Check if a given relative path from the routes matches the current location.
 * @param currentPathname The current router location.pathname, from useLocation.
 * @param path            The relative path to check for matches
 */
export const checkMatchesPath = (currentPathname, path) => {
  const match = matchPath(path, currentPathname);
  return match !== null;
};
