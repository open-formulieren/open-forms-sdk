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
 * Submission ID is persisted in the localStorage once a submission is started, and we
 * need to clear it for stories.
 *
 * The storage key is the form UUID, the default from api-mocks/form is
 * 'e450890a-4166-410e-8d64-0a54ad30ba01'. You can specify another key via parameters
 * or args.
 */
export const withClearSubmissionLocalStorage = (Story, {args, parameters}) => {
  const formId =
    args?.formId ?? parameters?.localStorage?.formId ?? 'e450890a-4166-410e-8d64-0a54ad30ba01';
  window.localStorage.removeItem(formId);
  return <Story />;
};

/**
 * This decorator wraps stories so that they are inside a container with the class name "utrecht-document". This is
 * needed so that components inherit the right font.
 */
export const utrechtDocumentDecorator = Story => {
  return (
    <div className="utrecht-document utrecht-document--surface">
      <Story />
    </div>
  );
};
