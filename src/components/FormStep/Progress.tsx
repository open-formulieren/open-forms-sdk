import SummaryProgress from '@/components/SummaryProgress';
import type {Form} from '@/data/forms';
import type {NestedSubmissionStep, Submission} from '@/data/submissions';

export interface ProgressProps {
  form: Form;
  submission: Submission;
  currentStep: NestedSubmissionStep;
}

/**
 * Take the form configuration options into account and derive the progress in the
 * current submission.
 */
const Progress: React.FC<ProgressProps> = ({form, submission, currentStep}) => {
  if (!form.showSummaryProgress) return null;
  const applicableSteps = submission.steps.filter(step => step.isApplicable === true);
  const currentSubmissionStepIndex = applicableSteps.indexOf(currentStep);
  return (
    <SummaryProgress current={currentSubmissionStepIndex + 1} total={applicableSteps.length} />
  );
};

export default Progress;
