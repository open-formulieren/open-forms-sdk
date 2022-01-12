import React, {useEffect} from 'react';
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
import useQuery from 'hooks/useQuery';
import Types from 'types';
import LoginButton, {
  START_FORM_QUERY_PARAM, LoginButtonIcon
} from 'components/LoginButton';


const useStartSubmission = () => {
  const query = useQuery();
  return !!query.get(START_FORM_QUERY_PARAM);
};

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
      <div className="start-message__explanation" dangerouslySetInnerHTML={{__html: form.explanationTemplate}}/>
      <div className="start-message__login">{startLoginMessage}</div>
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
  const hasAuthErrors = !!outagePluginId || !!authErrors;

  useEffect(() => {
    if (doStart && !hasAuthErrors) onFormStart();
  }, [doStart, hasAuthErrors, onFormStart]);

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
