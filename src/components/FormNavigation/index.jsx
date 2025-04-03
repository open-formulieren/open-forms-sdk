import {ButtonGroup} from '@utrecht/button-group-react';
import {Icon, LinkButton} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';

import AbortButton from 'components/AbortButton';
import {OFButton} from 'components/Button';
import FAIcon from 'components/FAIcon';
import {Literal} from 'components/Literal';
import Loader from 'components/Loader';
import PreviousLink from 'components/PreviousLink';
import {SUBMISSION_ALLOWED} from 'components/constants';

const FormNavigation = ({
  canSubmitStep,
  canSubmitForm,
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
        <OFButton type="submit" variant="primary" name="next" disabled={!canSubmitStep}>
          {isCheckingLogic ? (
            <Loader modifiers={['centered', 'only-child', 'small', 'gray']} />
          ) : (
            <>
              <Literal name="nextText" />
              <Icon>
                <FAIcon icon="arrow-right-long" />
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
        <LinkButton name="save" onClick={onFormSave}>
          <Icon>
            <FAIcon icon="circle-pause" />
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

FormNavigation.propTypes = {
  canSubmitStep: PropTypes.bool.isRequired,
  canSubmitForm: PropTypes.string.isRequired,
  canSuspendForm: PropTypes.bool.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  isCheckingLogic: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  hideAbortButton: PropTypes.bool,
  onNavigatePrevPage: PropTypes.func,
  onFormSave: PropTypes.func.isRequired,
  previousPage: PropTypes.string,
  onDestroySession: PropTypes.func.isRequired,
};

export default FormNavigation;
