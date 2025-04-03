import {ButtonGroup} from '@utrecht/button-group-react';
import {Icon, LinkButton} from '@utrecht/component-library-react';

import FAIcon from 'components/FAIcon';
import {Literal} from 'components/Literal';

import AbortButton from '@/components/AbortButton';
import {OFButton} from '@/components/Button';
import Loader from '@/components/Loader';
import PreviousLink from '@/components/PreviousLink';
import {SUBMISSION_ALLOWED} from '@/components/constants';

export interface FormNavigationProps {
  canSubmitStep: boolean;
  canSubmitForm: 'yes' | 'no_with_overview' | 'no_without_overview';
  submitButtonLiteral?: 'nextText' | 'confirmText';
  onSubmitClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  canSuspendForm: boolean;
  isLastStep: boolean;
  isCheckingLogic: boolean;
  isAuthenticated: boolean;
  hideAbortButton?: boolean;
  onNavigatePrevPage?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onFormSave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  previousPage?: string;
  onDestroySession: () => Promise<void>;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  canSubmitStep,
  canSubmitForm,
  submitButtonLiteral = 'nextText',
  onSubmitClick,
  canSuspendForm,
  isLastStep,
  isCheckingLogic,
  isAuthenticated,
  hideAbortButton,
  onNavigatePrevPage,
  onFormSave,
  previousPage,
  onDestroySession,
}) => {
  const showSubmitButton = !(canSubmitForm === SUBMISSION_ALLOWED.noWithoutOverview && isLastStep);

  return (
    <ButtonGroup
      className="utrecht-button-group--distanced openforms-form-navigation"
      direction="column"
    >
      {showSubmitButton && (
        <OFButton
          type="submit"
          name="next"
          disabled={!canSubmitStep}
          onClick={onSubmitClick}
          variant="primary"
          className="openforms-form-navigation__next-button"
        >
          {isCheckingLogic ? (
            <Loader modifiers={['centered', 'only-child', 'small', 'gray']} />
          ) : (
            <>
              <Literal name={submitButtonLiteral} />
              <Icon>
                <FAIcon icon="" extraClassName="fa-fw" />
              </Icon>
            </>
          )}
        </OFButton>
      )}

      {previousPage && (
        <PreviousLink to={previousPage} onClick={onNavigatePrevPage} position="end" />
      )}

      {/* TODO: refactor: `const canSuspendForm = onFormSave === undefined` - this does not
          need to be its own prop */}
      {canSuspendForm && (
        <LinkButton
          name="save"
          onClick={onFormSave}
          className="openforms-form-navigation__save-button"
        >
          <Icon>
            <FAIcon icon="" extraClassName="fa-fw" />
          </Icon>
          <Literal name="saveText" />
        </LinkButton>
      )}

      {!hideAbortButton && (
        <AbortButton isAuthenticated={isAuthenticated} onDestroySession={onDestroySession} />
      )}
    </ButtonGroup>
  );
};

export default FormNavigation;
