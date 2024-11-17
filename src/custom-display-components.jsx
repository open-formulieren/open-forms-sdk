import React from 'react';

import Body from 'components/Body';
import {STEP_LABELS} from 'components/ProgressIndicator/constants';

const CustomAppDisplay = ({router, languageSwitcher = null, appDebug = null}) => (
  <div style={{maxWidth: '1200px', margin: '0 auto'}}>
    <div style={{display: 'flex', justifyContent: 'center'}}>{languageSwitcher}</div>
    <div>{router}</div>
    {appDebug ? <div>{appDebug}</div> : null}
  </div>
);

const FormDisplay = ({
  router,
  progressIndicator = null,
  showProgressIndicator = true,
  isPaymentOverview = false,
}) => {
  const renderProgressIndicator = progressIndicator && showProgressIndicator && !isPaymentOverview;
  return (
    <>
      {renderProgressIndicator ? (
        <div style={{marginBottom: '1em'}}>{progressIndicator}</div>
      ) : null}
      <div>{router}</div>
    </>
  );
};

const ProgressIndicatorDisplay = ({
  activeStepTitle,
  formTitle,
  steps,
  hasSubmission,
  isStartPage,
  isSummary,
  isConfirmation,
  isSubmissionComplete,
  areApplicableStepsCompleted,
  showOverview,
  showConfirmation,
}) => {
  const overviewLabel = showOverview ? STEP_LABELS.overview : false;
  const confirmationLabel = showConfirmation ? STEP_LABELS.confirmation : false;

  const labels = [
    STEP_LABELS.login,
    ...steps.map(step => step.formDefinition),
    overviewLabel,
    confirmationLabel,
  ].filter(Boolean);

  let children = [];
  labels.forEach((label, index) => {
    const isLast = index === labels.length - 1;
    children.push(
      <span key={index} style={{padding: '1em'}}>
        <Body>{label}</Body>
      </span>
    );
    if (!isLast)
      children.push(
        <span key={`sep-${index}`} style={{padding: '0 1em'}}>
          •
        </span>
      );
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'var(--of-color-primary)',
        color: 'var(--of-color-bg)',
        '--of-color-fg': 'white',
      }}
    >
      {children}
    </div>
  );
};

const displayComponents = {
  app: CustomAppDisplay,
  form: FormDisplay,
  progressIndicator: ProgressIndicatorDisplay,
};

export default displayComponents;
