import {
  Button as UtrechtButton,
  LinkButton as UtrechtLinkButton,
} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import React from 'react';

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
}) => {
  const showSubmitButton = !(canSubmitForm === SUBMISSION_ALLOWED.noWithoutOverview && isLastStep);

  return (
    <>
      <LiteralsProvider literals={literals}>
        <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
          <ToolbarList>
            {onNavigatePrevPage && (
              <UtrechtLinkButton onClick={onNavigatePrevPage} appearance="subtle-button">
                <Literal name="previousText" />
              </UtrechtLinkButton>
            )}
          </ToolbarList>
          <ToolbarList>
            {/* TODO: refactor: `const canSuspendForm = onFormSave === undefined` - this does not
            need to be its own prop */}
            {canSuspendForm && (
              <UtrechtButton
                type="button"
                appearance="secondary-action-button"
                name="save"
                onClick={onFormSave}
              >
                <Literal name="saveText" />
              </UtrechtButton>
            )}
            {showSubmitButton && (
              <UtrechtButton
                type="submit"
                appearance="primary-action-button"
                name="next"
                disabled={!canSubmitStep}
              >
                {isCheckingLogic ? (
                  <Loader modifiers={['centered', 'only-child', 'small']} />
                ) : (
                  <Literal name="nextText" />
                )}
              </UtrechtButton>
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
};

export default ButtonsToolbar;
