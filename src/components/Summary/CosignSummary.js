import React, {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useHistory} from 'react-router-dom';
import {useAsync} from 'react-use';
import {useImmerReducer} from 'use-immer';

import {ConfigContext} from 'Context';
import {destroy, post} from 'api';
import {LayoutColumn} from 'components/Layout';
import {LiteralsProvider} from 'components/Literal';
import {RequireSession} from 'components/Sessions';
import {SUBMISSION_ALLOWED} from 'components/constants';
import useRecycleSubmission from 'hooks/useRecycleSubmission';
import useSessionTimeout from 'hooks/useSessionTimeout';
import Types from 'types';

import GenericSummary from './GenericSummary';
import {getPrivacyPolicyInfo, loadSummaryData} from './utils';

const initialState = {
  submission: null,
  privacyInfo: {
    requiresPrivacyConsent: true,
    privacyLabel: '',
    policyAccepted: false,
  },
  summaryData: null,
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

const CosignSummary = ({form}) => {
  const history = useHistory();
  const intl = useIntl();
  const config = useContext(ConfigContext);
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  // The backend has added the submission to the session, but we need to load it
  const [loading, setSubmissionId, removeSubmissionId] = useRecycleSubmission(
    form,
    state.submission,
    submission =>
      dispatch({
        type: 'SUBMISSION_LOADED',
        payload: submission,
      }),
    error => {
      throw error;
    }
  );

  let submissionUrl = new URL(form.url);

  const {loading: loadingData, error: loadingDataError} = useAsync(async () => {
    if (!state.submission) return;

    submissionUrl.pathname = `/api/v2/submissions/${state.submission.id}`;

    let promises = [loadSummaryData(submissionUrl), getPrivacyPolicyInfo(config.baseUrl)];

    const [retrievedSummaryData, privacyInfo] = await Promise.all(promises);

    dispatch({type: 'LOADED_PRIVACY_INFO', payload: privacyInfo});
    dispatch({type: 'LOADED_SUMMARY_DATA', payload: retrievedSummaryData});
  }, [state.submission]);

  if (loadingDataError) throw loadingDataError;

  const onSubmit = async event => {
    event.preventDefault();

    submissionUrl.pathname = `/api/v2/submissions/${state.submission.id}/cosign`;
    await post(submissionUrl.href);

    history.push('/cosign/done');
  };

  const destroySession = async () => {
    await destroy(`${config.baseUrl}authentication/${state.submission.id}/session`);
    removeSubmissionId();
    dispatch({type: 'RESET', payload: initialState});
    history.push('/');
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

    await destroySession();
  };

  const [sessionExpired, expiryDate, resetSession] = useSessionTimeout(async () => {
    await destroySession();
  });

  return (
    <RequireSession expired={sessionExpired} expiryDate={expiryDate}>
      <LayoutColumn modifiers={['mobile-order-2', 'mobile-padding-top']}>
        <LiteralsProvider literals={form.literals}>
          <GenericSummary
            title={
              <FormattedMessage
                description="Check overview and co-sign"
                defaultMessage="Check and co-sign submission"
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
            onLogout={onLogout}
          />
        </LiteralsProvider>
      </LayoutColumn>
    </RequireSession>
  );
};

CosignSummary.propTypes = {
  form: Types.Form.isRequired,
};

export default CosignSummary;
