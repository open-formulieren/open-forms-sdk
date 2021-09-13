import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import AuthenticationOutage, { useDetectAuthenticationOutage } from 'components/auth/AuthenticationOutage';
import {useDetectAuthErrorMessages, AuthenticationErrors} from 'components/auth/AuthenticationErrors';
import Body from 'components/Body';
import Button from 'components/Button';
import Card from 'components/Card';
import MaintenanceMode from 'components/MaintenanceMode';
import { Toolbar, ToolbarList } from 'components/Toolbar';
import useQuery from 'hooks/useQuery';
import Types from 'types';

const START_FORM_QUERY_PARAM = '_start';

const getLoginUrl = (loginOption) => {
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set(START_FORM_QUERY_PARAM, '1');
  const loginUrl = new URL(loginOption.url);
  loginUrl.searchParams.set("next", nextUrl.toString());
  return loginUrl.toString();
};

const LoginButton = ({option}) => (
  <Button variant="primary" component="a" href={getLoginUrl(option)}>Inloggen met {option.label}</Button>
);

LoginButton.propTypes = {
  option: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    logo: PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageSrc: PropTypes.string.isRequired,
      href: PropTypes.string,
    }),
  }),
};


const LoginButtonIcons = ({ loginOptions }) => {
  const optionsWithIcons = loginOptions.filter(option => option.logo && option.logo.imageSrc);
  return (
    <>
      {optionsWithIcons.map(option => (
        <Button
          variant="image"
          component="input"
          type="image"
          href={option.logo.href}
          src={option.logo.imageSrc}
          key={option.identifier}
        />
      ))}
    </>
  );
};

LoginButtonIcons.propTypes = {
  loginOptions: PropTypes.arrayOf(PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    logo: PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageSrc: PropTypes.string.isRequired,
      href: PropTypes.string,
    }),
  })).isRequired,
};


const useStartSubmission = (onFormStart) => {
  const query = useQuery();
  return !!query.get(START_FORM_QUERY_PARAM);
};


/**
 * Form start screen.
 *
 * This is shown when the form is initially loaded and provides the explicit user
 * action to start the form, or (in the future) present the login button (DigiD,
 * eHerkenning...)
 */
const FormStart = ({ form, onFormStart }) => {
  const doStart = useStartSubmission(onFormStart);
  const outagePluginId = useDetectAuthenticationOutage();
  const authErrors = useDetectAuthErrorMessages();
  const hasAuthErrors = !!outagePluginId || !!authErrors;

  useEffect(() => {
    if (doStart && !hasAuthErrors) onFormStart();
  }, [doStart, outagePluginId, hasAuthErrors, onFormStart]);

  if (form.maintenanceMode) {
    return <MaintenanceMode title={form.publicName} />;
  }

  if (outagePluginId) {
    const loginOption = form.loginOptions.find(option => option.identifier === outagePluginId);
    if (!loginOption) throw new Error('Unknown login plugin identifier');
    return (
      <Card title={`Probleem - ${form.publicName}`}>
        <AuthenticationOutage loginOption={loginOption} />
      </Card>
    );
  }

  return (
    <Card title={form.publicName}>

      { !!authErrors ? <AuthenticationErrors parameters={authErrors}/> : null }

      <Body modifiers={['compact']}>Log in or start the form anonymously.</Body>

      <Toolbar modifiers={['start']}>
        <ToolbarList>
          { form.loginRequired
            ? null
            : (<Button variant="primary" component="a" href="#" onClick={onFormStart}>{form.literals.beginText.resolved}</Button>)
          }
          {
            form.loginOptions.map((option) => <LoginButton option={option} key={option.identifier} />)
          }
        </ToolbarList>

        <ToolbarList>
          <LoginButtonIcons loginOptions={form.loginOptions} />
        </ToolbarList>
      </Toolbar>

    </Card>
  );
};

FormStart.propTypes = {
  form: Types.Form.isRequired,
  onFormStart: PropTypes.func.isRequired,
};


export default FormStart;
