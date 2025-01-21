import {useIntl} from 'react-intl';
import {matchPath, useLocation, useMatch} from 'react-router-dom';

import ProgressIndicator from 'components/ProgressIndicator';
import {addFixedSteps, getStepsInfo} from 'components/ProgressIndicator/utils';
import {PI_TITLE, STEP_LABELS, SUBMISSION_ALLOWED} from 'components/constants';
import useFormContext from 'hooks/useFormContext';
import Types from 'types';

const getProgressIndicatorSteps = ({intl, form, submission, currentPathname, isCompleted}) => {
  const submissionAllowedSpec = submission?.submissionAllowed ?? form.submissionAllowed;
  const showOverview = submissionAllowedSpec !== SUBMISSION_ALLOWED.noWithoutOverview;
  const needsPayment = submission?.payment.isRequired ?? form.paymentRequired;

  const showNonApplicableSteps = !form.hideNonApplicableSteps;
  const filteredSteps =
    // first, process all the form steps in a format suitable for the PI
    getStepsInfo(form.steps, submission, currentPathname)
      // then, filter out the non-applicable steps if they should not be displayed
      .filter(step => showNonApplicableSteps || step.isApplicable);

  return addFixedSteps(
    intl,
    filteredSteps,
    submission,
    currentPathname,
    showOverview,
    needsPayment,
    isCompleted,
    !!form.introductionPageContent
  );
};

/**
 * Determine the 'step' title to render for the accessible mobile menu label.
 * @param  {IntlShape} intl  The `useIntl` return value.
 * @param  {String} pathname The pathname ('url') of the current location.
 * @param  {Object} form     The Open Forms form instance being rendered.
 * @return {String}          The (formatted) string for the step title/name.
 */
const getMobileStepTitle = (intl, pathname, form) => {
  // TODO replace absolute path check with relative
  if (matchPath('/introductie', pathname)) {
    return intl.formatMessage(STEP_LABELS.introduction);
  }
  if (matchPath('/startpagina', pathname)) {
    return intl.formatMessage(STEP_LABELS.login);
  }

  const stepMatch = matchPath('/stap/:step', pathname);
  if (stepMatch) {
    const slug = stepMatch.params.step;
    const step = form.steps.find(step => step.slug === slug);
    return step.formDefinition;
  }

  if (matchPath('/overzicht', pathname)) {
    return intl.formatMessage(STEP_LABELS.overview);
  }
  if (matchPath('/betalen', pathname)) {
    return intl.formatMessage(STEP_LABELS.payment);
  }

  // we *may* end up here in tests that haven't set up all routes and so path matches
  // fail.
  /* istanbul ignore next */
  return '';
};

/**
 * Component to configure the progress indicator for a specific form.
 *
 * This component encapsulates the render/no render behaviour of the progress indicator
 * by looking at the form configuration settings.
 */
const FormProgressIndicator = ({submission}) => {
  const form = useFormContext();
  const {pathname: currentPathname, state: routerState} = useLocation();
  const confirmationMatch = useMatch('/bevestiging');
  const intl = useIntl();

  // don't render anything if the form is configured to never display the progress
  // indicator, or we're on the final confirmation page
  if (!form.showProgressIndicator || confirmationMatch) {
    return null;
  }

  // otherwise collect the necessary information to render the PI.
  const isCompleted = !!routerState?.statusUrl;
  const steps = getProgressIndicatorSteps({intl, form, submission, currentPathname, isCompleted});

  const ariaMobileIconLabel = intl.formatMessage({
    description: 'Progress step indicator toggle icon (mobile)',
    defaultMessage: 'Toggle the progress status display',
  });

  const activeStepTitle = getMobileStepTitle(intl, currentPathname, form);
  const accessibleToggleStepsLabel = intl.formatMessage(
    {
      description: 'Active step accessible label in mobile progress indicator',
      defaultMessage: 'Current step in form {formName}: {activeStepTitle}',
    },
    {formName: form.name, activeStepTitle}
  );

  return (
    <ProgressIndicator
      title={PI_TITLE}
      formTitle={form.name}
      steps={steps}
      ariaMobileIconLabel={ariaMobileIconLabel}
      accessibleToggleStepsLabel={accessibleToggleStepsLabel}
    />
  );
};

FormProgressIndicator.propTypes = {
  submission: Types.Submission,
};

export default FormProgressIndicator;
