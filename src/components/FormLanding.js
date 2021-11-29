import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

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


/**
 * Form landing screen.
 */
const FormLanding = ({ form, onFormStart, getLoginUrl, startLoginMessage }) => {
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

FormLanding.propTypes = {
  form: Types.Form.isRequired,
  onFormStart: PropTypes.func.isRequired,
  startLoginMessage: PropTypes.node
};


export default FormLanding;
