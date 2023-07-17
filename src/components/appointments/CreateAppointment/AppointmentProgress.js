import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import {useIntl} from 'react-intl';
import {useLocation} from 'react-router-dom';

import {ConfigContext} from 'Context';
import ProgressIndicatorDisplay from 'components/ProgressIndicator/ProgressIndicatorDisplay';

import {useCreateAppointmentContext} from './CreateAppointmentState';
import {APPOINTMENT_STEPS, APPOINTMENT_STEP_PATHS, checkMatchesPath} from './routes';

const AppointmentProgress = ({title, currentStep}) => {
  const config = useContext(ConfigContext);
  const {submittedSteps} = useCreateAppointmentContext();
  const intl = useIntl();
  const {pathname: currentPathname} = useLocation();

  const [expanded, setExpanded] = useState(false);

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
      isCompleted: stepCompleted,
      isApplicable: true,
      isCurrent: checkMatchesPath(currentPathname, path),
      canNavigateTo: stepCompleted || previousStepCompleted || index === currentStepIndex,
      formDefinition: intl.formatMessage(name),
    };
  });

  const isSummary = checkMatchesPath(currentPathname, 'overzicht');

  const ProgressIndicatorDisplayComponent =
    config?.displayComponents?.progressIndicator ?? ProgressIndicatorDisplay;
  return (
    <ProgressIndicatorDisplayComponent
      activeStepTitle={steps[currentStepIndex].formDefinition}
      formTitle={title}
      steps={steps}
      hasSubmission
      isStartPage={false}
      summaryTo="overzicht"
      isSummary={isSummary}
      isConfirmation={false}
      isSubmissionComplete={false}
      areApplicableStepsCompleted={submittedSteps.length === APPOINTMENT_STEPS.length}
      showOverview
      showConfirmation
      expanded={expanded}
      onExpandClick={() => setExpanded(!expanded)}
    />
  );
};

AppointmentProgress.propTypes = {
  title: PropTypes.string.isRequired,
  currentStep: PropTypes.oneOf(APPOINTMENT_STEP_PATHS).isRequired,
};

export default AppointmentProgress;
