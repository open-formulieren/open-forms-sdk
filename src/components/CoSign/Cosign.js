import React, {useContext} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import {useImmerReducer} from 'use-immer';

import {ConfigContext} from 'Context';
import {destroy} from 'api';
import ErrorBoundary from 'components/ErrorBoundary';
import {CosignSummary} from 'components/Summary';
import useFormContext from 'hooks/useFormContext';

import CosignDone from './CosignDone';

const initialState = {
  submission: null,
  privacyInfo: {
    requiresPrivacyConsent: true,
    privacyLabel: '',
  },
  summaryData: [],
  reportUrl: '',
  cosignedSubmission: null,
};

const reducer = (draft, action) => {
  switch (action.type) {
    case 'SUBMISSION_LOADED': {
      draft.submission = action.payload;
      break;
    }
    case 'LOADED_DATA': {
      draft.privacyInfo = action.payload.privacyInfo;
      draft.summaryData = action.payload.summaryData;
      break;
    }
    case 'COSIGN_COMPLETE': {
      return {...initialState, reportUrl: action.payload};
    }
    case 'RESET': {
      return initialState;
    }
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
};

const Cosign = () => {
  const form = useFormContext();
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const navigate = useNavigate();
  const config = useContext(ConfigContext);

  const onDataLoaded = data => {
    dispatch({
      type: 'LOADED_DATA',
      payload: {privacyInfo: data.privacyInfo, summaryData: data.summaryData},
    });
  };

  const onCosignComplete = reportUrl => {
    dispatch({type: 'COSIGN_COMPLETE', payload: reportUrl});
    navigate('/cosign/done');
  };

  const onDestroySession = async () => {
    await destroy(`${config.baseUrl}authentication/${state.submission.id}/session`);

    dispatch({type: 'RESET'});
    navigate('/');
  };

  return (
    <ErrorBoundary useCard>
      <Routes>
        <Route
          path="check"
          element={
            <CosignSummary
              form={form}
              submission={state.submission}
              summaryData={state.summaryData}
              privacyInfo={state.privacyInfo}
              onSubmissionLoaded={submission =>
                dispatch({
                  type: 'SUBMISSION_LOADED',
                  payload: submission,
                })
              }
              onDataLoaded={onDataLoaded}
              onCosignComplete={onCosignComplete}
              onDestroySession={onDestroySession}
            />
          }
        />
        <Route path="done" element={<CosignDone reportDownloadUrl={state.reportUrl} />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default Cosign;
