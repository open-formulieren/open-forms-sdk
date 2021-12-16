import React from 'react';
import PropTypes from 'prop-types';

import {Literal, LiteralsProvider} from 'components/Literal';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import Button from 'components/Button';
import Loader from 'components/Loader';
import LogoutButton from 'components/LogoutButton';
import {SUBMISSION_ALLOWED} from 'components/constants';
import Types from 'types';


const ButtonsToolbar = ({form, literals, canSubmitStep, isLastStep, isCheckingLogic, onNavigatePrevPage, onFormSave, onLogout}) => {
  const showSubmitButton = !(form.submissionAllowed === SUBMISSION_ALLOWED.noWithoutOverview && isLastStep);

  return (
    <>
      <LiteralsProvider literals={literals}>
        <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
          <ToolbarList>
            <Button
              variant="anchor"
              component="a"
              onClick={onNavigatePrevPage}
            ><Literal name="previousText"/></Button>
          </ToolbarList>
          <ToolbarList>
            <Button
              type="button"
              variant="secondary"
              name="save"
              onClick={onFormSave}
            ><Literal name="saveText"/></Button>
            {
              showSubmitButton
              && (<Button
                type="submit"
                variant="primary"
                name="next"
                disabled={!canSubmitStep}
              >
                {
                  isCheckingLogic
                    ? (<Loader modifiers={['centered', 'only-child', 'small']}/>)
                    : (<Literal name="nextText"/>)
                }
              </Button>)
            }
          </ToolbarList>
        </Toolbar>
      </LiteralsProvider>
      {form.loginRequired ? <LogoutButton onLogout={onLogout}/> : null}
    </>
  );
};


ButtonsToolbar.propTypes = {
  form: Types.Form.isRequired,
  literals: PropTypes.object,
  canSubmitStep: PropTypes.bool.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  isCheckingLogic: PropTypes.bool.isRequired,
  onNavigatePrevPage: PropTypes.func.isRequired,
  onFormSave: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};


export default ButtonsToolbar;
