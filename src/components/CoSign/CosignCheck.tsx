import {useContext, useState} from 'react';
import {useNavigate} from 'react-router';

import {CosignSummary} from 'components/Summary';

import {ConfigContext} from '@/Context';
import {destroy} from '@/api';
import type {Submission} from '@/data/submissions';
import useFormContext from '@/hooks/useFormContext';

import {useCosignContext} from './Context';

/**
 * Fetch the submission summary data and display it, together with the controls to
 * confirm the submission and buttons to log out.
 *
 * @todo move submission loading to route loader
 * @todo move summary data loading to route loader
 */
const CosignCheck: React.FC = () => {
  const navigate = useNavigate();
  const config = useContext(ConfigContext);
  const form = useFormContext();
  const {onCosignComplete} = useCosignContext();

  const [submission, setSubmission] = useState<Submission | null>(null);

  const onDestroySession = async () => {
    if (submission === null) return;
    await destroy(`${config.baseUrl}authentication/${submission.id}/session`);
    setSubmission(null);
    navigate('/');
  };

  return (
    <CosignSummary
      form={form}
      submission={submission}
      onSubmissionLoaded={submission => setSubmission(submission)}
      onCosignComplete={onCosignComplete}
      onDestroySession={onDestroySession}
    />
  );
};

export default CosignCheck;
