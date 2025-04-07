import {Icon} from '@utrecht/component-library-react';

import FAIcon from 'components/FAIcon';
import {Literal} from 'components/Literal';

import {OFButton} from '@/components/Button';
import {SUBMISSION_ALLOWED} from '@/components/constants';
import type {Submission} from '@/data/submissions';

export interface FormSubmitButtonProps {
  isDisabled: boolean;
  canSubmitForm: Submission['submissionAllowed'];
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
}) => {
  if (canSubmitForm !== SUBMISSION_ALLOWED.yes) return null;
  return (
    <OFButton
      type="submit"
      name="next"
      disabled={isDisabled}
      variant="primary"
      className="openforms-form-navigation__next-button"
      onClick={onClick}
    >
      <Literal name="confirmText" />
      <Icon>
        <FAIcon icon="" extraClassName="fa-fw" />
      </Icon>
    </OFButton>
  );
};

export default FormSubmitButton;
