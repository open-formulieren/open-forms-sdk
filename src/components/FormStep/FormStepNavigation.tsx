import type {JSONObject} from '@open-formulieren/types';
import {useFormikContext} from 'formik';

import FormNavigation, {StepSubmitButton} from '@/components/FormNavigation';
import type {FormNavigationProps} from '@/components/FormNavigation/FormNavigation';
import type {Submission} from '@/data/submissions';

interface FormStepNavigationProps extends Pick<
  FormNavigationProps,
  'onFormSave' | 'previousPage' | 'isAuthenticated' | 'onDestroySession' | 'hideAbortButton'
> {
  submissionAllowed: Submission['submissionAllowed'];
  isLastStep: boolean;
  isCheckingLogic: boolean;
  stepSubmissionAllowed: boolean;
}

const FormStepNavigation: React.FC<FormStepNavigationProps> = ({
  submissionAllowed,
  stepSubmissionAllowed,
  isLastStep,
  isCheckingLogic,
  onFormSave,
  previousPage,
  isAuthenticated,
  onDestroySession,
  hideAbortButton = false,
}) => {
  const {isValid, isValidating, isSubmitting} = useFormikContext<JSONObject>();
  return (
    <FormNavigation
      submitButton={
        <StepSubmitButton
          canSubmitForm={submissionAllowed}
          canSubmitStep={stepSubmissionAllowed && isValid && !isValidating && !isSubmitting}
          isLastStep={isLastStep}
          isCheckingLogic={isCheckingLogic || isSubmitting}
        />
      }
      onFormSave={onFormSave}
      previousPage={previousPage}
      isAuthenticated={isAuthenticated}
      onDestroySession={onDestroySession}
      hideAbortButton={hideAbortButton}
    />
  );
};

export default FormStepNavigation;
