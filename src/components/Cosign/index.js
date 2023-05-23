import {ErrorBoundary} from '@sentry/react';
import React, {useContext, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {useAsync} from 'react-use';
import {useImmerReducer} from 'use-immer';

import {LiteralsProvider} from 'components/Literal';
import SummaryDisplay from 'components/Summary/SummaryDisplay';
import useRecycleSubmission from 'hooks/useRecycleSubmission';

import {ConfigContext} from '../../Context';
import {destroy, get, post} from '../../api';
import {LayoutColumn} from '../Layout';
import Loader from '../Loader';
import {SUBMISSION_ALLOWED} from '../constants';

const PRIVACY_POLICY_ENDPOINT = '/api/v2/config/privacy_policy_info';
const CoSignLayout = ({children}) => {
  return (
    <ErrorBoundary useCard>
      <LayoutColumn modifiers={['mobile-order-2', 'mobile-padding-top']}>{children}</LayoutColumn>
    </ErrorBoundary>
  );
};

const getPrivacyPolicyInfo = async origin => {
  const privacyPolicyUrl = new URL(PRIVACY_POLICY_ENDPOINT, origin);
  return await get(privacyPolicyUrl);
};

const loadSummaryData = async submissionUrl => {
  return await get(`${submissionUrl.href}/summary`);
};

const initialState = {
  submission: null,
  privacyInfo: {
    requiresPrivacyConsent: true,
    privacyLabel: '',
    policyAccepted: false,
  },
  summaryData: '',
};

const reducer = (draft, action) => {
  switch (action.type) {
    case 'SUBMISSION_LOADED': {
      draft.submission = action.payload;
      break;
    }
    case 'LOADED_PRIVACY_INFO': {
      draft.privacyInfo = {...draft.privacyInfo, ...action.payload};
      break;
    }
    case 'LOADED_SUMMARY_DATA': {
      draft.summaryData = action.payload;
      break;
    }
    case 'TOGGLE_PRIVACY_CHECKBOX': {
      draft.privacyInfo.policyAccepted = !draft.privacyInfo.policyAccepted;
      break;
    }
    case 'RESET': {
      const initialState = action.payload;
      return initialState;
    }
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
};

const CosignCheck = ({form}) => {
  const history = useHistory();
  const intl = useIntl();
  const config = useContext(ConfigContext);
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  // if there is an active submission still, re-load that (relevant for hard-refreshes)
  const [loading, setSubmissionId, removeSubmissionId] = useRecycleSubmission(
    form,
    state.submission,
    submission =>
      dispatch({
        type: 'SUBMISSION_LOADED',
        payload: submission,
      })
  );

  let submissionUrl = new URL(form.url);

  const {loading: loadingData} = useAsync(async () => {
    if (!state.submission) return;

    submissionUrl.pathname = `/api/v2/submissions/${state.submission.id}`;

    let promises = [loadSummaryData(submissionUrl), getPrivacyPolicyInfo(config.baseUrl)];

    const [retrievedSummaryData, privacyInfo] = await Promise.all(promises);
    //TODO deal with errors

    dispatch({type: 'LOADED_PRIVACY_INFO', payload: privacyInfo});
    dispatch({type: 'LOADED_SUMMARY_DATA', payload: retrievedSummaryData});
  }, [state.submission]);

  const onSubmit = async event => {
    event.preventDefault();

    submissionUrl.pathname = `/api/v2/submissions/${state.submission.id}/cosign`;
    await post(submissionUrl.href);

    history.push('/cosign/done');
  };

  const onLogout = async event => {
    event.preventDefault();

    const confirmationMessage = intl.formatMessage({
      description: 'log out confirmation prompt in cosign page',
      defaultMessage:
        'Are you sure that you want to logout and not co-sign the current form submission?',
    });

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    await destroy(`${config.baseUrl}authentication/${state.submission.id}/session`);
    removeSubmissionId();
    dispatch({type: 'RESET', payload: initialState});
  };

  if (loading || loadingData) {
    return (
      <LayoutColumn>
        <Loader modifiers={['centered']} />
      </LayoutColumn>
    );
  }

  return (
    <CoSignLayout>
      <LiteralsProvider literals={form.literals}>
        <SummaryDisplay
          title={
            <FormattedMessage
              description="Check overview and co-sign"
              defaultMessage="Check and co-sign"
            />
          }
          submissionAllowed={SUBMISSION_ALLOWED.yes}
          summaryData={state.summaryData}
          showPaymentInformation={false}
          privacyInformation={state.privacyInfo}
          showPreviousPageLink={false}
          editStepText=""
          isLoading={loading || loadingData}
          isAuthenticated={true}
          onPrivacyCheckboxChange={() => dispatch({type: 'TOGGLE_PRIVACY_CHECKBOX'})}
          onSubmit={onSubmit}
          onLogout={() => console.log('TODO')}
        />
      </LiteralsProvider>
    </CoSignLayout>
  );
};

export default CosignCheck;
