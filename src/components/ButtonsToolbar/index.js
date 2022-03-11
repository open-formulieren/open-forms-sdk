import React from 'react';
import PropTypes from 'prop-types';

import {Literal, LiteralsProvider} from 'components/Literal';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {Button as DHButton} from "@gemeente-denhaag/button";
import Loader from 'components/Loader';
import LogoutButton from 'components/LogoutButton';
import {SUBMISSION_ALLOWED} from 'components/constants';
import {ArrowRightIcon} from "@gemeente-denhaag/icons";

const ButtonsToolbar = ({literals, canSubmitStep, canSubmitForm, loginRequired, isAuthenticated, isLastStep, isCheckingLogic, onNavigatePrevPage, onFormSave, onLogout}) => {
  const showSubmitButton = !(canSubmitForm === SUBMISSION_ALLOWED.noWithoutOverview && isLastStep);

  return (
    <>
      <LiteralsProvider literals={literals}>
        <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
          {/*<ToolbarList>
            <Button
              variant="anchor"
              component="a"
              onClick={onNavigatePrevPage}
            ><Literal name="previousText"/></Button>
          </ToolbarList>*/}
          <ToolbarList>
            {
              showSubmitButton
              && (<DHButton
                type="submit"
                variant="primary"
                name="next"
                disabled={!canSubmitStep}
                icon={<ArrowRightIcon />}
                iconAlign="end"
              >
                {
                  isCheckingLogic
                    ? (<Loader modifiers={['centered', 'only-child', 'small']}/>)
                    : (<Literal name="nextText"/>)
                }
              </DHButton>)
            }
            <DHButton
              type="button"
              variant="secondary-action"
              name="save"
              onClick={onFormSave}
            ><Literal name="saveText"/></DHButton>
          </ToolbarList>
        </Toolbar>
      </LiteralsProvider>
      {isAuthenticated ? <LogoutButton onLogout={onLogout}/> : null}
    </>
  );
};


ButtonsToolbar.propTypes = {
  literals: PropTypes.object,
  canSubmitStep: PropTypes.bool.isRequired,
  canSubmitForm: PropTypes.string.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  loginRequired: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isCheckingLogic: PropTypes.bool.isRequired,
  onNavigatePrevPage: PropTypes.func.isRequired,
  onFormSave: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};


export default ButtonsToolbar;
