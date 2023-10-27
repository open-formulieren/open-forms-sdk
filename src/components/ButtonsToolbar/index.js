import PropTypes from 'prop-types';
import React from 'react';

import Anchor from 'components/Anchor';
import {OFButton} from 'components/Button';
import {Literal, LiteralsProvider} from 'components/Literal';
import Loader from 'components/Loader';
import LogoutButton from 'components/LogoutButton';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {SUBMISSION_ALLOWED} from 'components/constants';

const ButtonsToolbar = ({
  literals,
  canSubmitStep,
  canSubmitForm,
  canSuspendForm,
  isAuthenticated,
  isLastStep,
  isCheckingLogic,
  onNavigatePrevPage,
  onFormSave,
  onLogout,
  previousPage,
}) => {
  const showSubmitButton = !(canSubmitForm === SUBMISSION_ALLOWED.noWithoutOverview && isLastStep);

  return (
    <>
      <LiteralsProvider literals={literals}>
        <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
          <ToolbarList>
            {onNavigatePrevPage && (
              <Anchor href={previousPage} onClick={onNavigatePrevPage}>
                <Literal name="previousText" />
              </Anchor>
            )}
          </ToolbarList>
          <ToolbarList>
            {/* TODO: refactor: `const canSuspendForm = onFormSave === undefined` - this does not
            need to be its own prop */}
            {canSuspendForm && (
              <OFButton
                type="button"
                appearance="secondary-action-button"
                name="save"
                onClick={onFormSave}
              >
                <Literal name="saveText" />
              </OFButton>
            )}
            {showSubmitButton && (
              <OFButton
                type="submit"
                appearance="primary-action-button"
                name="next"
                disabled={!canSubmitStep}
              >
                {isCheckingLogic ? (
                  <Loader modifiers={['centered', 'only-child', 'small', 'gray']} />
                ) : (
                  <Literal name="nextText" />
                )}
              </OFButton>
            )}
          </ToolbarList>
        </Toolbar>
      </LiteralsProvider>
      {isAuthenticated ? <LogoutButton onLogout={onLogout} /> : null}
    </>
  );
};

ButtonsToolbar.propTypes = {
  literals: PropTypes.object,
  canSubmitStep: PropTypes.bool.isRequired,
  canSubmitForm: PropTypes.string.isRequired,
  canSuspendForm: PropTypes.bool.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isCheckingLogic: PropTypes.bool.isRequired,
  onNavigatePrevPage: PropTypes.func,
  onFormSave: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  previousPage: PropTypes.string.isRequired,
};

export default ButtonsToolbar;
