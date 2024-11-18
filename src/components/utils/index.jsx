import {START_FORM_QUERY_PARAM} from 'components/constants';

const findPreviousApplicableStep = (currentStepIndex, submission) => {
  let candidateStepIndex = currentStepIndex - 1;
  while (candidateStepIndex >= 0 && !submission.steps[candidateStepIndex].isApplicable) {
    candidateStepIndex = candidateStepIndex - 1;
    if (candidateStepIndex < 0) break;
  }
  return candidateStepIndex;
};

const findNextApplicableStep = (currentStepIndex, submission) => {
  let candidateStepIndex = currentStepIndex + 1;
  if (candidateStepIndex >= submission.steps.length) return candidateStepIndex;

  while (!submission.steps[candidateStepIndex].isApplicable) {
    candidateStepIndex = candidateStepIndex + 1;
    if (!submission.steps[candidateStepIndex]) break;
  }
  return candidateStepIndex;
};

const isLastStep = (currentStepIndex, submission) => {
  return currentStepIndex === submission.steps.length - 1;
};

const getLoginUrl = (loginOption, extraParams = {}, extraNextParams = {}) => {
  if (loginOption.url === '#') return loginOption.url;
  const nextUrl = new URL(window.location.href);

  const queryParams = Array.from(nextUrl.searchParams.keys());
  queryParams.map(param => nextUrl.searchParams.delete(param));

  const loginUrl = new URL(loginOption.url);

  Object.entries(extraParams).map(([key, value]) => loginUrl.searchParams.set(key, value));

  if (!loginUrl.searchParams.has('coSignSubmission')) {
    nextUrl.searchParams.set(START_FORM_QUERY_PARAM, '1');
  }
  Object.entries(extraNextParams).map(([key, value]) => nextUrl.searchParams.set(key, value));
  loginUrl.searchParams.set('next', nextUrl.toString());
  return loginUrl.toString();
};

const getCosignLoginUrl = (loginOption, extraParams = {}) => {
  const loginUrl = new URL(loginOption.url);
  const nextUrl = new URL(loginUrl.searchParams.get('next'));
  Object.entries(extraParams).forEach(([key, value]) => nextUrl.searchParams.set(key, value));
  loginUrl.searchParams.set('next', nextUrl.toString());
  return loginUrl.toString();
};

const getLoginRedirectUrl = form => {
  // Automatically redirect the user to a specific login option (if configured)
  if (form.autoLoginAuthenticationBackend) {
    let autoLoginOption = form.loginOptions.find(
      option => option.identifier === form.autoLoginAuthenticationBackend
    );

    if (autoLoginOption) {
      return getLoginUrl(autoLoginOption);
    }
  }
};

const eventTriggeredBySubmitButton = event => {
  const submitterAttributes = event.nativeEvent.submitter.attributes;

  for (const attribute of submitterAttributes) {
    if (attribute.name === 'type' && attribute.value === 'submit') return true;
  }

  return false;
};

export {
  findNextApplicableStep,
  findPreviousApplicableStep,
  isLastStep,
  getLoginRedirectUrl,
  getLoginUrl,
  getCosignLoginUrl,
  eventTriggeredBySubmitButton,
};
