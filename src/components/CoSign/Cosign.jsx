import {useContext} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import {useImmerReducer} from 'use-immer';

import {ConfigContext} from 'Context';
import {destroy} from 'api';
import ErrorBoundary from 'components/Errors/ErrorBoundary';
import {CosignSummary} from 'components/Summary';
import useFormContext from 'hooks/useFormContext';

import CosignDone from './CosignDone';
import CosignStart from './CosignStart';

const initialState = {
  submission: null,
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
    case 'LOADED_SUMMARY_DATA': {
      draft.summaryData = action.payload;
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
        <Route path="start" element={<CosignStart />} />
        <Route
          path="check"
          element={
            <CosignSummary
              form={form}
              submission={state.submission}
              summaryData={state.summaryData}
              onSubmissionLoaded={submission =>
                dispatch({
                  type: 'SUBMISSION_LOADED',
                  payload: submission,
                })
              }
              onDataLoaded={({summaryData}) =>
                dispatch({type: 'LOADED_SUMMARY_DATA', payload: summaryData})
              }
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
