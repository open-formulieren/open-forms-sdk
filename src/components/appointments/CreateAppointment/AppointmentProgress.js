import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import {useLocation} from 'react-router-dom';

import {ConfigContext} from 'Context';
import ProgressIndicator from 'components/ProgressIndicator';
import {PI_TITLE, STEP_LABELS} from 'components/constants';
import {checkMatchesPath} from 'components/utils/routers';

import {useCreateAppointmentContext} from './CreateAppointmentState';
import {APPOINTMENT_STEPS, APPOINTMENT_STEP_PATHS} from './routes';

const AppointmentProgress = ({title, currentStep}) => {
  const config = useContext(ConfigContext);
  const {submission, submittedSteps} = useCreateAppointmentContext();
  const intl = useIntl();
  const {pathname: currentPathname} = useLocation();

  const isConfirmation = checkMatchesPath(currentPathname, 'bevestiging');
  const isSummary = checkMatchesPath(currentPathname, 'overzicht');

  const isSubmissionComplete = isConfirmation && submission === null;
  const showOverview = true;
  const showConfirmation = true;

  const currentStepIndex = APPOINTMENT_STEP_PATHS.indexOf(currentStep);
  const steps = APPOINTMENT_STEPS.map(({path, name}) => {
    const index = APPOINTMENT_STEP_PATHS.indexOf(path);
    const previousStepIndex = Math.max(index - 1, 0);

    const previousStepCompleted = submittedSteps.includes(
      APPOINTMENT_STEP_PATHS[previousStepIndex]
    );
    const stepCompleted = submittedSteps.includes(path);

    return {
      to: path,
      label: intl.formatMessage(name),
      isCompleted: stepCompleted || isSubmissionComplete,
      isApplicable: true,
      isCurrent: checkMatchesPath(currentPathname, path),
      canNavigateTo:
        stepCompleted ||
        previousStepCompleted ||
        index === currentStepIndex ||
        isSubmissionComplete,
    };
  });

  // Add the fixed steps to the the original steps array
  const summaryStep = {
    to: 'overzicht',
    label: intl.formatMessage(STEP_LABELS.overview),
    isCompleted: isConfirmation,
    isApplicable: true,
    isCurrent: checkMatchesPath(currentPathname, 'overzicht'),
    canNavigateTo: false,
  };

  const confirmationStep = {
    to: 'bevestiging',
    label: intl.formatMessage(STEP_LABELS.confirmation),
    isCompleted: isSubmissionComplete,
    isCurrent: checkMatchesPath(currentPathname, 'bevestiging'),
  };

  const finalSteps = [...steps, showOverview && summaryStep, showConfirmation && confirmationStep];

  // Figure out the title for the mobile menu based on the state
  let activeStepTitle;
  if (isSummary) {
    activeStepTitle = intl.formatMessage(STEP_LABELS.overview);
  } else if (isConfirmation) {
    activeStepTitle = intl.formatMessage(STEP_LABELS.confirmation);
  } else {
    activeStepTitle = currentStep;
  }

  const ariaMobileIconLabel = intl.formatMessage({
    description: 'Progress step indicator toggle icon (mobile)',
    defaultMessage: 'Toggle the progress status display',
  });

  const accessibleToggleStepsLabel = intl.formatMessage(
    {
      description: 'Active step accessible label in mobile progress indicator',
      defaultMessage: 'Current step in form {title}: {activeStepTitle}',
    },
    {title, activeStepTitle}
  );

  const ProgressIndicatorComponent =
    config?.displayComponents?.progressIndicator ?? ProgressIndicator;
  return (
    <ProgressIndicatorComponent
      title={PI_TITLE}
      formTitle={title}
      steps={finalSteps}
      ariaMobileIconLabel={ariaMobileIconLabel}
      accessibleToggleStepsLabel={accessibleToggleStepsLabel}
    />
  );
};

AppointmentProgress.propTypes = {
  title: PropTypes.string.isRequired,
  currentStep: PropTypes.oneOf(APPOINTMENT_STEP_PATHS).isRequired,
};

export default AppointmentProgress;
