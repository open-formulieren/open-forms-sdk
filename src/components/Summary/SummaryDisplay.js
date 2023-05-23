import React from 'react';

import Card from 'components/Card';
import FormStepSummary from 'components/FormStepSummary';
import Loader from 'components/Loader';
import LogoutButton from 'components/LogoutButton';
import Price from 'components/Price';
import SummaryConfirmation from 'components/SummaryConfirmation';
import {SUBMISSION_ALLOWED} from 'components/constants';

const SummaryDisplay = ({
  title,
  submissionAllowed,
  summaryData,
  showPaymentInformation,
  amountToPay,
  showPreviousPageLink,
  privacyInformation,
  editStepText,
  isLoading,
  isAuthenticated,
  onPrivacyCheckboxChange,
  onSubmit,
  onLogout,
  onPrevPage = null,
}) => {
  const Wrapper = submissionAllowed === SUBMISSION_ALLOWED.yes ? 'form' : 'div';
  return (
    <Card title={title}>
      {/*  ERROR MESSAGES? */}
      <Wrapper onSubmit={onSubmit}>
        {isLoading || !summaryData ? (
          <Loader modifiers={['centered']} />
        ) : (
          <>
            {summaryData.map((step, index) => (
              <FormStepSummary
                key={index}
                slug={step.slug}
                name={step.name}
                data={step.data}
                editStepText={editStepText}
              />
            ))}
          </>
        )}

        {showPaymentInformation && <Price price={amountToPay} />}

        <SummaryConfirmation
          submissionAllowed={submissionAllowed}
          privacy={privacyInformation}
          showPreviousPageLink={showPreviousPageLink}
          onPrivacyCheckboxChange={onPrivacyCheckboxChange}
          onPrevPage={onPrevPage}
        />

        {isAuthenticated ? <LogoutButton onLogout={onLogout} /> : null}
      </Wrapper>
    </Card>
  );
};

export default SummaryDisplay;
