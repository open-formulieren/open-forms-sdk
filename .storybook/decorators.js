/**
 * Storybook does not have a before/after cleanup cycle, and localStorage would in
 * these situations break story/test isolation.
 *
 * This decorator is applied to every story to reset the storage state.
 */
export const withClearSessionStorage = Story => {
  window.sessionStorage.clear();
  return <Story />;
};
