import React from 'react';

import {Literal, LiteralsProvider} from 'components/Literal';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import Button from 'components/Button';
import Loader from 'components/Loader';
import LogoutButton from 'components/LogoutButton';


const ButtonsToolbar = ({form, literals, canSubmitStep, onNavigatePrevPage, onFormSave, onLogout, isCheckingLogic}) => {
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
            <Button
              type="submit"
              variant="primary"
              name="next"
              disabled={!canSubmitStep}
            >
              {
                isCheckingLogic
                ? (<Loader modifiers={['centered', 'only-child', 'small']} />)
                : (<Literal name="nextText"/>)
              }
            </Button>
          </ToolbarList>
        </Toolbar>
      </LiteralsProvider>
      {form.loginRequired ? <LogoutButton onLogout={onLogout}/> : null}
    </>
  );
};


export default ButtonsToolbar;
