import React, {useContext, useEffect, useState} from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';

import {ConfigContext} from 'Context';
import ProgressIndicatorDisplay from 'components/ProgressIndicator/ProgressIndicatorDisplay';
import {STEP_LABELS} from 'components/ProgressIndicator/constants';

const AppointmentProgressIndicator = ({title}) => {
  // todo refactor
  const {pathname} = useLocation();
  const [expanded, setExpanded] = useState(false);

  // collapse the expanded progress indicator if nav occurred, see
  // open-formulieren/open-forms#2673. It's important that *only* the pathname triggers
  // the effect, which is why exhaustive deps is ignored.
  useEffect(() => {
    if (expanded) {
      setExpanded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const config = useContext(ConfigContext);
  const summaryMatch = !!useRouteMatch('/appointment/overzicht');
  const confirmationMatch = !!useRouteMatch('/appointment/bevestiging');
  const appointmentMatch = !!useRouteMatch('/appointment');

  // figure out the title for the mobile menu based on the state
  let activeStepTitle;
  if (summaryMatch) {
    activeStepTitle = STEP_LABELS.overview;
  } else if (confirmationMatch) {
    activeStepTitle = STEP_LABELS.confirmation;
  } else {
    activeStepTitle = STEP_LABELS.appointment;
  }

  const ProgressIndicatorDisplayComponent =
    config?.displayComponents?.progressIndicator ?? ProgressIndicatorDisplay;

  return (
    <ProgressIndicatorDisplayComponent
      activeStepTitle={activeStepTitle}
      formTitle={title}
      steps={[]}
      hasSubmission={false}
      isStartPage={false}
      isSummary={summaryMatch}
      isConfirmation={confirmationMatch}
      isAppointment={appointmentMatch}
      isSubmissionComplete={false}
      areApplicableStepsCompleted={false}
      showOverview={true}
      showConfirmation={true}
      showAppointment={true}
      onExpandClick={() => setExpanded(!expanded)}
    />
  );
};

export default AppointmentProgressIndicator;
