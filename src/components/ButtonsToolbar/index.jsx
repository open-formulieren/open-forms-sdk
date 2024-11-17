import PropTypes from 'prop-types';
import React from 'react';

import AbortButton from 'components/AbortButton';
import {OFButton} from 'components/Button';
import {Literal} from 'components/Literal';
import Loader from 'components/Loader';
import PreviousLink from 'components/PreviousLink';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {SUBMISSION_ALLOWED} from 'components/constants';

const ButtonsToolbar = ({
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
    <>
      <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
        <ToolbarList>
          {previousPage && (
            <PreviousLink to={previousPage} onClick={onNavigatePrevPage} position="end" />
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
      {!hideAbortButton && (
        <Toolbar modifiers={['bottom', 'reverse']}>
          <ToolbarList>
            <AbortButton isAuthenticated={isAuthenticated} onDestroySession={onDestroySession} />
          </ToolbarList>
        </Toolbar>
      )}
    </>
  );
};

ButtonsToolbar.propTypes = {
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

export default ButtonsToolbar;
