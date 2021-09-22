import React from 'react';
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
import Price from 'components/Price';
import Types from 'types';
import { flattenComponents } from 'utils';

const PRIVACY_POLICY_ENDPOINT = '/api/v1/config/privacy_policy_info';

const initialState = {
  privacy: {
    requiresPrivacyConsent: true,
    privacyLabel: '',
    policyAccepted: false,
  },
  product: {
    uuid: '',
    url: '',
    name: '',
    price: '',
  }
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
    case 'PRODUCT_LOADED': {
      draft.product = {...action.payload, price: parseFloat(action.payload.price)};
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

const getProductInfo = async (url) => {
  if (!url) return;

  return await get(url);
};


const Summary = ({ form, submission, processingError='', onConfirm, onLogout }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const history = useHistory();
  const {loading, value: submissionSteps, error} = useAsync(
    async () => {
      const submissionUrl = new URL(submission.url);

      let promises = [
        loadStepsData(submission),
        getPrivacyPolicyInfo(submissionUrl.origin),
        getProductInfo(form.product),
      ];

      const [submissionSteps, privacyInfo, productInfo] = await Promise.all(promises);

      dispatch({type: 'PRIVACY_POLICY_LOADED', payload: privacyInfo});
      if (productInfo) dispatch({type: 'PRODUCT_LOADED', payload: productInfo});

      return submissionSteps;
    },
    [submission]
  );

  const lastStep = form.steps[form.steps.length - 1];
  const prevPageUrl = `/stap/${lastStep.slug}`;

  if (error) {
    console.error(error);
  }

  const submitDisabled = loading || (state.privacy.requiresPrivacyConsent && !state.privacy.policyAccepted);

  const onSubmit = async (event) => {
    event.preventDefault();
    const {statusUrl} = await completeSubmission(submission);
    onConfirm(statusUrl);
  };

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
        { state.product.price ? <Price price={state.product.price} /> : null }
        {
          !loading && state.privacy.requiresPrivacyConsent ?
            <PrivacyCheckbox
              value={state.privacy.policyAccepted}
              label={state.privacy.privacyLabel}
              onChange={(e) => dispatch({type: 'PRIVACY_POLICY_TOGGLE'})}
            />
          : null
        }
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
