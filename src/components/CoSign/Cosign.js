import React, {useContext} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import {useImmerReducer} from 'use-immer';

import {destroy} from 'api';
import ErrorBoundary from 'components/ErrorBoundary';
import {CosignSummary} from 'components/Summary';

import {ConfigContext} from '../../Context';
import CosignDone from './CosignDone';

const initialState = {
  submission: null,
  privacyInfo: {
    requiresPrivacyConsent: true,
    privacyLabel: '',
    policyAccepted: false,
  },
  summaryData: null,
  reportUrl: '',
  cosignedSubmission: null,
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
    case 'COSIGN_COMPLETE': {
      return {...initialState, reportUrl: action.payload};
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

const Cosign = ({...props}) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const navigate = useNavigate();
  const config = useContext(ConfigContext);

  const onDataLoaded = data => {
    dispatch({type: 'LOADED_PRIVACY_INFO', payload: data.privacyInfo});
    dispatch({type: 'LOADED_SUMMARY_DATA', payload: data.summaryData});
  };

  const onCosignComplete = reportUrl => {
    dispatch({type: 'COSIGN_COMPLETE', payload: reportUrl});
    navigate('/cosign/done');
  };

  const onDestroySession = async () => {
    await destroy(`${config.baseUrl}authentication/${state.submission.id}/session`);

    dispatch({type: 'RESET', payload: initialState});
    navigate('/');
  };

  return (
    <ErrorBoundary useCard>
      <Routes>
        <Route
          path="check"
          element={
            <CosignSummary
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
              onPrivacyCheckboxChange={() => dispatch({type: 'TOGGLE_PRIVACY_CHECKBOX'})}
              {...props}
            />
          }
        />
        <Route path="done" element={<CosignDone reportDownloadUrl={state.reportUrl} />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default Cosign;
