import {Icon} from '@utrecht/component-library-react';

import FAIcon from 'components/FAIcon';
import {Literal} from 'components/Literal';

import {OFButton} from '@/components/Button';
import Loader from '@/components/Loader';
import {SUBMISSION_ALLOWED} from '@/components/constants';
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
  if (canSubmitForm === SUBMISSION_ALLOWED.noWithoutOverview && isLastStep) return null;
  return (
    <OFButton
      type="submit"
      name="next"
      disabled={!canSubmitStep || isCheckingLogic}
      variant="primary"
      className="openforms-form-navigation__next-button"
    >
      {isCheckingLogic ? (
        <Loader modifiers={['centered', 'only-child', 'small', 'gray']} />
      ) : (
        <>
          <Literal name="nextText" />
          <Icon>
            <FAIcon icon="" extraClassName="fa-fw" />
          </Icon>
        </>
      )}
    </OFButton>
  );
};

export default StepSubmitButton;
