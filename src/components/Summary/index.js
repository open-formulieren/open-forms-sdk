import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {useAsync} from 'react-use';
import { useHistory } from 'react-router-dom';
import {useImmerReducer} from 'use-immer';

import { get, post } from 'api';
import Button from 'components/Button';
import Card from 'components/Card';
import ErrorMessage from 'components/ErrorMessage';
import FormStepSummary from 'components/FormStepSummary';
import Loader from 'components/Loader';
import LogoutButton from 'components/LogoutButton';
import PrivacyCheckbox from 'components/PrivacyCheckbox';
import { Toolbar, ToolbarList } from 'components/Toolbar';
import Types from 'types';
import { flattenComponents } from 'utils';
import {CAPTCHA_ASSESSMENT_ENDPOINT, PRIVACY_POLICY_ENDPOINT} from '../../constants';
import {ConfigContext} from '../../Context';


const initialState = {
  privacy: {
    requiresPrivacyConsent: true,
    privacyLabel: '',
    policyAccepted: false,
  },
  reCaptcha: {
    isReady: false,
    errors: ''
  },
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
    case 'RECAPTCHA_READY': {
      draft.reCaptcha.isReady = true;
      break;
    }
    case 'RECAPTCHA_ERROR': {
      draft.reCaptcha.error = action.payload;
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
    } else {
      return response.data;
    }
};

const getPrivacyPolicyInfo = async (origin) => {
  const privacyPolicyUrl = new URL(PRIVACY_POLICY_ENDPOINT, origin);
  return await get(privacyPolicyUrl);
};


const Summary = ({ form, submission, processingError='', onConfirm, onLogout }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const history = useHistory();
  const config = useContext(ConfigContext);
  const baseApiUrl = new URL(config.baseUrl);

  const {loading, value: submissionSteps, error} = useAsync(
    async () => {
      if (window.grecaptcha) {
        window.grecaptcha.enterprise.ready(() => dispatch({type: 'RECAPTCHA_READY'}));
      }

      const promises = [
        loadStepsData(submission),
        getPrivacyPolicyInfo(baseApiUrl.origin),
      ];

      const [submissionSteps, privacyInfo] = await Promise.all(promises);
      dispatch({type: 'PRIVACY_POLICY_LOADED', payload: privacyInfo});

      return submissionSteps;
    },
    [submission]
  );

  const lastStep = form.steps[form.steps.length - 1];
  const prevPageUrl = `/stap/${lastStep.slug}`;

  if (error) {
    console.error(error);
  }

  const executeCaptcha = async () => {
    if (!state.reCaptcha.isReady) {
      throw new Error('Something went wrong. The ReCAPTCHA client is not ready.');
    }

    // This makes a call to a google API and returns a token for
    // this user interaction
    return await window.grecaptcha.enterprise.execute(
      config.reCaptchaSiteKey,
      {action: 'formSubmission'}
    );
  };

  const getCaptchaAssessment = async (token) => {
    const captchaBackendUrl = new URL(CAPTCHA_ASSESSMENT_ENDPOINT, baseApiUrl.origin);
    const assessmentResponse = await post(captchaBackendUrl, {token: token, action: 'formSubmission'});
    if (!assessmentResponse.ok) {
      throw new Error('Something went wrong. Could not get a reCAPTCHA assessment.');
    } else if (!assessmentResponse.data.allowSubmission) {
      throw new Error('You did not pass the reCAPTCHA test.');
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = await executeCaptcha();
      await getCaptchaAssessment(token);
    } catch (e) {
      dispatch({type: 'RECAPTCHA_ERROR', payload: e.message});
      return null;
    }

    const {statusUrl} = await completeSubmission(submission);
    onConfirm(statusUrl);
  };

  const submitDisabled = loading || (state.privacy.requiresPrivacyConsent && !state.privacy.policyAccepted);
  return (
    <Card title="Controleer en bevestig">

      { processingError ? <ErrorMessage>{processingError}</ErrorMessage> : null }

      <form onSubmit={onSubmit}>
        { loading ? <Loader modifiers={['centered']} /> : null }
        {submissionSteps && submissionSteps.map((stepData, i) => (
          <FormStepSummary
            key={stepData.submissionStep.id}
            stepData={stepData}
            editStepUrl={`/stap/${form.steps[i].slug}`}
            editStepText={form.literals.changeText.resolved}
          />
        ))}
        {
          !loading && state.privacy.requiresPrivacyConsent ?
            <PrivacyCheckbox
              value={state.privacy.policyAccepted}
              label={state.privacy.privacyLabel}
              onChange={(e) => dispatch({type: 'PRIVACY_POLICY_TOGGLE'})}
            />
          : null
        }
        { state.reCaptcha.error ? <ErrorMessage>{state.reCaptcha.error}</ErrorMessage> : null}
        <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
          <ToolbarList>
            <Button
              variant="anchor"
              component="a"
              href={prevPageUrl}
              onClick={event => {
                event.preventDefault();
                history.push(prevPageUrl);
              }}
            >{form.literals.previousText.resolved}</Button>
          </ToolbarList>
          <ToolbarList>
            <Button type="submit" variant="primary" name="confirm" disabled={submitDisabled}>
              {form.literals.confirmText.resolved}
            </Button>
          </ToolbarList>
        </Toolbar>
        {form.loginRequired ? <LogoutButton onLogout={onLogout}/> : null}
      </form>
    </Card>
  );
};

Summary.propTypes = {
  form: Types.Form.isRequired,
  submission: PropTypes.object.isRequired,
  processingError: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};


export default Summary;
