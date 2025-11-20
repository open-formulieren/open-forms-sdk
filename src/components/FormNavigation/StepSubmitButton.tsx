import {LoadingIndicator, PrimaryActionButton} from '@open-formulieren/formio-renderer';
import {Icon} from '@utrecht/component-library-react';

import FAIcon from '@/components/FAIcon';
import {Literal} from '@/components/Literal';
import type {Submission} from '@/data/submissions';

export interface StepSubmitButtonProps {
  canSubmitStep: boolean;
  isCheckingLogic: boolean;
  canSubmitForm: Submission['submissionAllowed'];
  isLastStep: boolean;
}

/**
 * The submit button rendered to submit a form step. Not to be confused with the
 * submit button to complete the form.
 *
 * The submit button is displayed when:
 * - the current step is not the last step
 * - the current step is the last step and the overview will be displayed
 */
const StepSubmitButton: React.FC<StepSubmitButtonProps> = ({
  canSubmitStep,
  isCheckingLogic,
  canSubmitForm,
  isLastStep,
}) => {
  if (canSubmitForm === 'no_without_overview' && isLastStep) return null;
  return (
    <PrimaryActionButton
      type="submit"
      name="next"
      disabled={!canSubmitStep || isCheckingLogic}
      className="openforms-form-navigation__next-button"
    >
      {isCheckingLogic ? (
        <LoadingIndicator position="center" size="small" color="muted" />
      ) : (
        <>
          <Literal name="nextText" />
          <Icon>
            <FAIcon icon="" className="fa-fw" />
          </Icon>
        </>
      )}
    </PrimaryActionButton>
  );
};

export default StepSubmitButton;
