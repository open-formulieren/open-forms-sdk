import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';

import AuthenticationOutage, { useDetectAuthenticationOutage } from 'components/auth/AuthenticationOutage';
import {useDetectAuthErrorMessages, AuthenticationErrors} from 'components/auth/AuthenticationErrors';
import Body from 'components/Body';
import Button from 'components/Button';
import Card from 'components/Card';
import {Literal, LiteralsProvider} from 'components/Literal';
import MaintenanceMode from 'components/MaintenanceMode';
import { Toolbar, ToolbarList } from 'components/Toolbar';
import useQuery from 'hooks/useQuery';
import Types from 'types';
import LoginButton, {START_FORM_QUERY_PARAM} from 'components/LoginButton';
import LoginButtonIcons from 'components/LoginButtonIcons';


const useStartSubmission = () => {
  const query = useQuery();
  return !!query.get(START_FORM_QUERY_PARAM);
};


const getLoginUrl = (loginOption) => {
  const nextUrl = new URL(window.location.href);

  const queryParams = Array.from(nextUrl.searchParams.keys());
  queryParams.map(param => nextUrl.searchParams.delete(param));

  nextUrl.searchParams.set(START_FORM_QUERY_PARAM, '1');
  const loginUrl = new URL(loginOption.url);
  loginUrl.searchParams.set('next', nextUrl.toString());
  return loginUrl.toString();
};


/**
 * Form start screen.
 *
 * This is shown when the form is initially loaded and provides the explicit user
 * action to start the form, or (in the future) present the login button (DigiD,
 * eHerkenning...)
 */
const FormStart = ({ form, onFormStart }) => {
  const intl = useIntl();
  const doStart = useStartSubmission();
  const outagePluginId = useDetectAuthenticationOutage();
  const authErrors = useDetectAuthErrorMessages();
  const hasAuthErrors = !!outagePluginId || !!authErrors;

  useEffect(() => {
    if (doStart && !hasAuthErrors) onFormStart();
  }, [doStart, outagePluginId, hasAuthErrors, onFormStart]);

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
    <LiteralsProvider literals={form.literals}>
      <Card title={form.name}>

        { !!authErrors ? <AuthenticationErrors parameters={authErrors}/> : null }

        <Body modifiers={['compact']}>
          {startLoginMessage}
        </Body>

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
              form.loginOptions.map((option) => (
                <LoginButton
                  key={option.identifier}
                  option={option}
                  getLoginUrl={getLoginUrl}
                />
              ))
            }
          </ToolbarList>

          <ToolbarList>
            <LoginButtonIcons loginOptions={form.loginOptions} />
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
