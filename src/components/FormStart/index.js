import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';

import AuthenticationOutage, { useDetectAuthenticationOutage } from 'components/auth/AuthenticationOutage';
import {useDetectAuthErrorMessages, AuthenticationErrors} from 'components/auth/AuthenticationErrors';
import Body from 'components/Body';
import Button from 'components/Button';
import Card from 'components/Card';
import {Literal, LiteralsProvider} from 'components/Literal';
import Loader from 'components/Loader';
import MaintenanceMode from 'components/MaintenanceMode';
import { Toolbar, ToolbarList } from 'components/Toolbar';
import Types from 'types';
import LoginButton, {LoginButtonIcon} from 'components/LoginButton';
import {getBEMClassName} from 'utils';
import useStartSubmission from 'hooks/useStartSubmission';


const FormStartMessage = ({form}) => {
  const intl = useIntl();

  const canLogin = form.loginOptions.length > 0;
  const startLoginMessage = form.loginRequired
    ? intl.formatMessage({
        description: 'Form start login required body text',
        defaultMessage: 'Please authenticate to start the form.'
    })
    : canLogin
      ? intl.formatMessage({
          description: 'Form start anonymous or login body text',
          defaultMessage: 'Please authenticate or start the form anonymously.'
      })
      : intl.formatMessage({
         description: 'Form start (no login available) body text',
         defaultMessage: 'Please click the button below to start the form.'
      })
  ;
  return (
    <Body modifiers={['compact']} component="div">
      <div className={getBEMClassName('body', ['wysiwyg'])} dangerouslySetInnerHTML={{__html: form.explanationTemplate}}/>
      <div>{startLoginMessage}</div>
    </Body>
  );
};


/**
 * Form start screen.
 *
 * This is shown when the form is initially loaded and provides the explicit user
 * action to start the form, or (in the future) present the login button (DigiD,
 * eHerkenning...)
 */
const FormStart = ({ form, onFormStart }) => {
  const doStart = useStartSubmission();
  const outagePluginId = useDetectAuthenticationOutage();
  const authErrors = useDetectAuthErrorMessages();
  const [error, setError] = useState(null);
  const hasAuthErrors = !!outagePluginId || !!authErrors;

  const onFormStartCalledRef = useRef(false);

  useEffect(() => {
    // if it's already called, do not call it again as this creates 'infite' cycles.
    // This component is re-mounted/re-rendered because of parent component state changes,
    // while the start marker is still in the querystring. Therefore, once we have called
    // the callback, we keep track of this call being done so that it's invoked only once.
    // See https://github.com/open-formulieren/open-forms/issues/1174
    if (onFormStartCalledRef.current) {
      return;
    }

    const startForm = async () => {
      try {
        await onFormStart();
      } catch (e) {
        setError(e);
      }
    }

    if (doStart && !hasAuthErrors) {
      startForm();
      onFormStartCalledRef.current = true;
    }
  }, [doStart, hasAuthErrors, onFormStart]);

  // let errors bubble up to the error boundaries
  if (error) {
    throw error;
  }

  // do not re-render the login options while we're redirecting
  if (doStart && !hasAuthErrors) {
    return (
      <Card>
        <Loader modifiers={['centered', 'only-child']} />
      </Card>
    );
  }

  if (form.maintenanceMode) {
    return <MaintenanceMode title={form.name} />;
  }

  if (outagePluginId) {
    const loginOption = form.loginOptions.find(option => option.identifier === outagePluginId);
    if (!loginOption) throw new Error('Unknown login plugin identifier');
    return (
      <Card title={
        <FormattedMessage description="Form start outage title" defaultMessage="Problem - {formName}" values={{formName: form.name}} />
      }>
        <AuthenticationOutage loginOption={loginOption} />
      </Card>
    );
  }
  const optionsWithIcons = form.loginOptions.filter(option => option.logo && option.logo.imageSrc);

  return (
    <LiteralsProvider literals={form.literals}>
      <Card title={form.name}>

        { !!authErrors ? <AuthenticationErrors parameters={authErrors}/> : null }

        <FormStartMessage form={form}/>

        <Toolbar modifiers={['start']}>
          <ToolbarList>
            { form.loginRequired
              ? null
              : (
                  <Button variant="primary" component="a" href="#" onClick={onFormStart}>
                    <Literal name="beginText" />
                  </Button>
              )
            }
            {
              form.loginOptions.map((option) => <LoginButton option={option} key={option.identifier} />)
            }
          </ToolbarList>

          <ToolbarList>
           {
             optionsWithIcons.map(option => (
              <LoginButtonIcon key={option.identifier} identifier={option.identifier} logo={option.logo} />
             ))
           }
          </ToolbarList>
        </Toolbar>

      </Card>
    </LiteralsProvider>
  );
};

FormStart.propTypes = {
  form: Types.Form.isRequired,
  onFormStart: PropTypes.func.isRequired,
};


export default FormStart;
