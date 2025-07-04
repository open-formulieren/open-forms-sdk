import {ButtonGroup} from '@utrecht/button-group-react';
import {Icon, LinkButton} from '@utrecht/component-library-react';

import FAIcon from 'components/FAIcon';
import {Literal} from 'components/Literal';

import AbortButton from '@/components/AbortButton';
import PreviousLink from '@/components/PreviousLink';

export interface FormNavigationProps {
  submitButton: React.ReactNode;
  onFormSave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  previousPage?: string;
  onNavigatePrevPage?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  hideAbortButton?: boolean;
  isAuthenticated: boolean;
  onDestroySession: () => Promise<void>;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  submitButton,
  isAuthenticated,
  hideAbortButton,
  onNavigatePrevPage,
  onFormSave,
  previousPage,
  onDestroySession,
}) => (
  <ButtonGroup className="openforms-form-navigation" direction="column">
    {submitButton}

    {previousPage && <PreviousLink to={previousPage} onClick={onNavigatePrevPage} position="end" />}

    {onFormSave && (
      <LinkButton
        name="save"
        onClick={onFormSave}
        className="openforms-form-navigation__save-button"
      >
        <Icon>
          <FAIcon icon="" className="fa-fw" />
        </Icon>
        <Literal name="saveText" />
      </LinkButton>
    )}

    {!hideAbortButton && (
      <AbortButton isAuthenticated={isAuthenticated} onDestroySession={onDestroySession} />
    )}
  </ButtonGroup>
);

export default FormNavigation;
