import {useContext, useState} from 'react';
import {useNavigate} from 'react-router';

import {CosignSummary} from 'components/Summary';

import {ConfigContext} from '@/Context';
import {destroy} from '@/api';
import {Submission} from '@/data/submissions';
import useFormContext from '@/hooks/useFormContext';

import {useCosignContext} from './Context';

type _SummaryData = Array<{
  name?: string;
  slgu?: string;
  data?: Array<object>;
}>;

/**
 * Fetch the submission summary data and display it, together with the controls to
 * confirm the submission and buttons to log out.
 */
const CosignCheck: React.FC = () => {
  const navigate = useNavigate();
  const config = useContext(ConfigContext);
  const form = useFormContext();
  const {onCosignComplete} = useCosignContext();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [summaryData, setSummaryData] = useState<_SummaryData>([]);

  const onDestroySession = async () => {
    if (submission === null) return;
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

export default CosignCheck;
