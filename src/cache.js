/**
 * Cache values in the sessionStorage.
 *
 * The sessionStorage is similar to localStorage, except it's isolated between browser
 * tabs/windows and clears when the browser 'session' ends.
 */

// TODO: replace with tanstack useQuery at some point

export const getCached = (cacheKey, maxAge) => {
  const cachedValue = window.sessionStorage.getItem(cacheKey);
  if (cachedValue === null) return null;
  const {value, timestamp} = JSON.parse(cachedValue);
  // check if it's expired
  const now = new Date().getTime();
  const minTimestamp = now - maxAge;
  if (timestamp < minTimestamp) {
    window.sessionStorage.removeItem(cacheKey);
    return null;
  }
  return value;
};

export const setCached = (cacheKey, value) => {
  const now = new Date().getTime();
  const serialized = JSON.stringify({value, timestamp: now});
  window.sessionStorage.setItem(cacheKey, serialized);
};
