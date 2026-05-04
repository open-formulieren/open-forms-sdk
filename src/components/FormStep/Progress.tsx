import SummaryProgress from '@/components/SummaryProgress';
import type {Form, MinimalFormStep} from '@/data/forms';
import type {NestedSubmissionStep, Submission} from '@/data/submissions';

export interface ProgressProps {
  form: Form;
  submission: Submission | null;
  currentStep: NestedSubmissionStep | MinimalFormStep;
}

/**
 * Take the form configuration options into account and derive the progress in the
 * current submission.
 */
const Progress: React.FC<ProgressProps> = ({form, submission, currentStep}) => {
  if (!form.showSummaryProgress) return null;

  // single page forms do not use submission (we create the submission when the form is
  // submitted) and have only one step
  const applicableSteps = submission
    ? submission.steps.filter(step => step.isApplicable)
    : [currentStep];
  const currentSubmissionStepIndex = submission ? applicableSteps.indexOf(currentStep) : 0;

  return (
    <SummaryProgress current={currentSubmissionStepIndex + 1} total={applicableSteps.length} />
  );
};

export default Progress;
