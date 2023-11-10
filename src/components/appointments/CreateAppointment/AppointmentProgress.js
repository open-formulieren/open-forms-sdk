import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import {useLocation} from 'react-router-dom';

import {ConfigContext} from 'Context';
import ProgressIndicator from 'components/ProgressIndicator';
import {addFixedSteps} from 'components/ProgressIndicator/utils';

import {useCreateAppointmentContext} from './CreateAppointmentState';
import {APPOINTMENT_STEPS, APPOINTMENT_STEP_PATHS, checkMatchesPath} from './routes';

const AppointmentProgress = ({title, currentStep}) => {
  const config = useContext(ConfigContext);
  const {submission, submittedSteps} = useCreateAppointmentContext();
  const intl = useIntl();
  const {pathname: currentPathname} = useLocation();

  const isConfirmation = checkMatchesPath(currentPathname, 'bevestiging');
  const isSummary = checkMatchesPath(currentPathname, 'overzicht');
  const isStartPage =
    !isSummary && !isConfirmation && !APPOINTMENT_STEP_PATHS.includes(currentStep);

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
      uuid: `appointments-${path}`,
      to: path,
      isCompleted: stepCompleted || isSubmissionComplete,
      isApplicable: true,
      isCurrent: checkMatchesPath(currentPathname, path),
      canNavigateTo:
        stepCompleted ||
        previousStepCompleted ||
        index === currentStepIndex ||
        isSubmissionComplete,
      formDefinition: intl.formatMessage(name),
    };
  });

  // Add the fixed steps to the the original steps array
  const stepsToRender = addFixedSteps(
    steps,
    submission,
    currentPathname,
    showOverview,
    showConfirmation,
    isSubmissionComplete
  );

  // Figure out the title for the mobile menu based on the state
  let activeStepTitle;
  if (isStartPage) {
    activeStepTitle = intl.formatMessage({
      description: 'Start page title',
      defaultMessage: 'Start page',
    });
  } else if (isSummary) {
    activeStepTitle = intl.formatMessage({
      description: 'Summary page title',
      defaultMessage: 'Summary',
    });
  } else if (isConfirmation) {
    activeStepTitle = intl.formatMessage({
      description: 'Confirmation page title',
      defaultMessage: 'Confirmation',
    });
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
      progressIndicatorTitle="Progress"
      formTitle={title}
      steps={stepsToRender}
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
