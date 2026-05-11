import SummaryProgress from '@/components/SummaryProgress';
import type {Form} from '@/data/forms';
import type {NestedSubmissionStep, Submission} from '@/data/submissions';

export interface ProgressProps {
  form: Form;
  submission: Submission | null;
  currentStep: NestedSubmissionStep;
}

/**
 * Take the form configuration options into account and derive the progress in the
 * current submission.
 */
const Progress: React.FC<ProgressProps> = ({form, submission, currentStep}) => {
  // single step forms do not have a submission at this point and the have only one step
  if (submission === null || !form.showSummaryProgress) return null;

  // single page forms do not use submission (we create the submission when the form is
  // submitted) and have only one step
  const applicableSteps = submission.steps.filter(step => step.isApplicable);
  const currentSubmissionStepIndex = applicableSteps.indexOf(currentStep);

  return (
    <SummaryProgress current={currentSubmissionStepIndex + 1} total={applicableSteps.length} />
  );
};

export default Progress;
