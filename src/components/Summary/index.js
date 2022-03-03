import React from 'react';
import PropTypes from 'prop-types';
import {useAsync} from 'react-use';
import { useHistory } from 'react-router-dom';
import {useImmerReducer} from 'use-immer';

import { get, post } from 'api';
import Card from 'components/Card';
import ErrorMessage from 'components/ErrorMessage';
import FormStepSummary from 'components/FormStepSummary';
import {LiteralsProvider} from 'components/Literal';
import Loader from 'components/Loader';
import LogoutButton from 'components/LogoutButton';
import Price from 'components/Price';
import {findPreviousApplicableStep} from 'components/utils';
import {SubmissionContext} from 'Context';
import useRefreshSubmission from 'hooks/useRefreshSubmission';
import Types from 'types';
import { flattenComponents } from 'utils';
import SummaryConfirmation from 'components/SummaryConfirmation';
import {SUBMISSION_ALLOWED} from 'components/constants';


const PRIVACY_POLICY_ENDPOINT = '/api/v1/config/privacy_policy_info';

const initialState = {
  privacy: {
    requiresPrivacyConsent: true,
    privacyLabel: '',
    policyAccepted: false,
  },
  error: ''
};

const reducer = (draft, action) => {
  switch (action.type) {
    case 'PRIVACY_POLICY_LOADED': {
      draft.privacy = {...draft.privacy, ...action.payload};
      break;
    }
    case 'PRIVACY_POLICY_TOGGLE': {
      draft.privacy.policyAccepted = !draft.privacy.policyAccepted;
      break;
    }
    case 'ERROR': {
      draft.error = action.payload;
      break;
    }
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
};


const loadStepsData = async (submission) => {
  const stepsData = await Promise.all(submission.steps.map(async (submissionStep) => {
    const submissionStepDetail = await get(submissionStep.url);
    const formStepDetail = await get(submissionStep.formStep);
    const formDefinitionDetail = await get(formStepDetail.formDefinition);
    return {
      submissionStep,
      title: formDefinitionDetail.name,
      data: submissionStepDetail.data,
      configuration: submissionStepDetail.formStep.configuration
    };
  }));
  stepsData.map(stepData => stepData.configuration.components = flattenComponents(stepData.configuration.components));
  return stepsData;
};

const completeSubmission = async (submission) => {
    const response = await post(`${submission.url}/_complete`);
    if (!response.ok) {
      console.error(response.data);
      // TODO Specific error for each type of invalid data?
      throw new Error('InvalidSubmissionData');
    } else {
      return response.data;
    }
};

const getPrivacyPolicyInfo = async (origin) => {
  const privacyPolicyUrl = new URL(PRIVACY_POLICY_ENDPOINT, origin);
  return await get(privacyPolicyUrl);
};

const PaymentInformation = ({isRequired, amount='', hasPaid}) => {
  if (!isRequired || hasPaid) return null;

  return (<Price price={amount} />);
};

PaymentInformation.propTypes = {
  isRequired: PropTypes.bool.isRequired,
  amount: PropTypes.string,
  hasPaid: PropTypes.bool.isRequired,
};


const Summary = ({ form, submission, processingError='', onConfirm, onLogout, onClearProcessingErrors }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const history = useHistory();

  const refreshedSubmission = useRefreshSubmission(submission);

  const {loading, value: submissionSteps, error} = useAsync(
    async () => {
      const submissionUrl = new URL(refreshedSubmission.url);

      let promises = [
        loadStepsData(refreshedSubmission),
        getPrivacyPolicyInfo(submissionUrl.origin),
      ];

      const [submissionSteps, privacyInfo] = await Promise.all(promises);

      dispatch({type: 'PRIVACY_POLICY_LOADED', payload: privacyInfo});

      return submissionSteps;
    },
    [refreshedSubmission]
  );

  if (error) {
    console.error(error);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    if (refreshedSubmission.submissionAllowed !== SUBMISSION_ALLOWED.yes) return;
    try {
      const {statusUrl} = await completeSubmission(refreshedSubmission);
      onConfirm(statusUrl);
    } catch (e) {
      dispatch({type: 'ERROR', payload: e.message});
    }
  };

  const onPrevPage = (event) => {
    event.preventDefault();
    onClearProcessingErrors()

    const previousStepIndex = findPreviousApplicableStep(form.steps.length, submission);
    const prevStepSlug = form.steps[previousStepIndex]?.slug;
    const navigateTo = prevStepSlug ? `/stap/${prevStepSlug}` : '/';
    history.push(navigateTo);
  };

  const Wrapper = refreshedSubmission.submissionAllowed === SUBMISSION_ALLOWED.yes ? 'form' : 'div';

  return (
    <Card title="Controleer en bevestig">

      { processingError ? <ErrorMessage>{processingError}</ErrorMessage> : null }
      { state.error ? <ErrorMessage>{state.error}</ErrorMessage> : null }

      <LiteralsProvider literals={form.literals}>
        <Wrapper onSubmit={onSubmit}>
          <SubmissionContext.Provider value={{submission: refreshedSubmission}}>
          { loading
            ? (<Loader modifiers={['centered']} />)
            : (
              <>
                {submissionSteps && submissionSteps.map((stepData, i) => (
                  <FormStepSummary
                    key={stepData.submissionStep.id}
                    stepData={stepData}
                    editStepUrl={`/stap/${form.steps[i].slug}`}
                    editStepText={form.literals.changeText.resolved}
                  />
                ))}

                <PaymentInformation {...refreshedSubmission.payment} />

                <SummaryConfirmation
                  submissionAllowed={refreshedSubmission.submissionAllowed}
                  privacy={state.privacy}
                  onPrivacyCheckboxChange={(e) => dispatch({type: 'PRIVACY_POLICY_TOGGLE'})}
                  onPrevPage={onPrevPage}
                />

                {form.loginRequired ? <LogoutButton onLogout={onLogout}/> : null}
              </>
            )
          }
        </SubmissionContext.Provider>
        </Wrapper>
      </LiteralsProvider>
    </Card>
  );
};

Summary.propTypes = {
  form: Types.Form.isRequired,
  submission: Types.Submission,
  processingError: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};


export default Summary;
