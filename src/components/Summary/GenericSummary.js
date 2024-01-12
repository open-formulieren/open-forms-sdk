import {Form, Formik} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import AbortionButton from 'components/AbortionButton';
import Card from 'components/Card';
import ErrorMessage from 'components/Errors/ErrorMessage';
import FormStepSummary from 'components/FormStepSummary';
import Loader from 'components/Loader';
import Price from 'components/Price';
import SummaryConfirmation from 'components/SummaryConfirmation';
import {SUBMISSION_ALLOWED} from 'components/constants';

const GenericSummary = ({
  title,
  submissionAllowed,
  summaryData = [],
  showPaymentInformation,
  amountToPay,
  editStepText,
  isLoading,
  isAuthenticated,
  prevPage,
  errors = [],
  onSubmit,
  onDestroySession,
  onPrevPage = null,
}) => {
  const Wrapper = submissionAllowed === SUBMISSION_ALLOWED.yes ? Form : 'div';

  if (isLoading) {
    return <Loader modifiers={['centered']} />;
  }

  return (
    <Card title={title}>
      {errors.map(error => (
        <ErrorMessage key={error}>{error}</ErrorMessage>
      ))}
      <Formik
        initialValues={{privacyPolicyAccepted: false, statementOfTruthAccepted: false}}
        onSubmit={(values, actions) => {
          onSubmit(values);
          actions.setSubmitting(false);
        }}
      >
        <Wrapper>
          {summaryData.map((step, index) => (
            <FormStepSummary
              key={`${index}-${step.slug}`}
              slug={step.slug}
              name={step.name}
              data={step.data}
              editStepText={editStepText}
            />
          ))}
          {showPaymentInformation && <Price price={amountToPay} />}
          <SummaryConfirmation
            submissionAllowed={submissionAllowed}
            prevPage={prevPage}
            onPrevPage={onPrevPage}
          />
          <AbortionButton isAuthenticated={isAuthenticated} onDestroySession={onDestroySession} />
        </Wrapper>
      </Formik>
    </Card>
  );
};

GenericSummary.propTypes = {
  title: PropTypes.node,
  submissionAllowed: PropTypes.oneOf([
    SUBMISSION_ALLOWED.yes,
    SUBMISSION_ALLOWED.noWithOverview,
    SUBMISSION_ALLOWED.noWithoutOverview,
  ]),
  summaryData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
            PropTypes.array,
            PropTypes.number,
            PropTypes.bool,
          ]),
          component: PropTypes.object.isRequired,
        })
      ).isRequired,
    })
  ),
  showPaymentInformation: PropTypes.bool,
  amountToPay: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  editStepText: PropTypes.string,
  isLoading: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
  prevPage: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onDestroySession: PropTypes.func.isRequired,
  onPrevPage: PropTypes.func,
};

export default GenericSummary;
