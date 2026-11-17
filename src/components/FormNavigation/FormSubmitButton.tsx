import {LoadingIndicator, PrimaryActionButton} from '@open-formulieren/formio-renderer';
import {Icon} from '@utrecht/component-library-react';

import FAIcon from '@/components/FAIcon';
import {Literal} from '@/components/Literal';
import type {Submission} from '@/data/submissions';

export interface FormSubmitButtonProps {
  isDisabled: boolean;
  canSubmitForm: Submission['submissionAllowed'];
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isSubmitting: boolean;
}

/**
 * The submit button rendered to complete the form submission, displayed on the
 * overview/summary page.
 *
 * The submit button is not displayed when `canSubmitForm` indicates submission is not
 * possible.
 */
const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  isDisabled,
  canSubmitForm,
  onClick,
  isSubmitting,
}) => {
  if (canSubmitForm !== 'yes') return null;
  return (
    <PrimaryActionButton
      type="submit"
      name="next"
      disabled={isDisabled || isSubmitting}
      className="openforms-form-navigation__next-button"
      onClick={onClick}
      data-testid="form-submit-button"
    >
      {isSubmitting ? (
        <LoadingIndicator position="center" size="small" color="muted" />
      ) : (
        <>
          <Literal name="confirmText" />
          <Icon>
            <FAIcon icon="" className="fa-fw" />
          </Icon>
        </>
      )}
    </PrimaryActionButton>
  );
};

export default FormSubmitButton;
