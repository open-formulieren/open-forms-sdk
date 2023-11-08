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

/**
 * This decorator wraps stories so that they are inside a container with the class name "utrecht-document". This is
 * needed so that components inherit the right font.
 */
export const utrechtDocumentDecorator = Story => {
  return (<div className="utrecht-document utrecht-document--surface" ><Story/></div>);
};
