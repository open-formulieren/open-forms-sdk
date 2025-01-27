import {useContext, useState} from 'react';
import {useNavigate} from 'react-router';

import {ConfigContext} from 'Context';
import {destroy} from 'api';
import {CosignSummary} from 'components/Summary';
import useFormContext from 'hooks/useFormContext';

import {useCosignContext} from './Context';

/**
 * Fetch the submission summary data and display it, together with the controls to
 * confirm the submission and buttons to log out.
 */
const CosignCheck = () => {
  const navigate = useNavigate();
  const config = useContext(ConfigContext);
  const form = useFormContext();
  const {onCosignComplete} = useCosignContext();

  const [submission, setSubmission] = useState(null);
  const [summaryData, setSummaryData] = useState([]);

  const onDestroySession = async () => {
    await destroy(`${config.baseUrl}authentication/${submission.id}/session`);
    setSubmission(null);
    setSummaryData([]);
    navigate('/');
  };

  return (
    <CosignSummary
      form={form}
      submission={submission}
      summaryData={summaryData}
      onSubmissionLoaded={submission => setSubmission(submission)}
      onDataLoaded={({summaryData}) => setSummaryData(summaryData)}
      onCosignComplete={onCosignComplete}
      onDestroySession={onDestroySession}
    />
  );
};

CosignCheck.propTypes = {};

export default CosignCheck;
