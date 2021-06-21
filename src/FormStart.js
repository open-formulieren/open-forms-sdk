import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Card from './Card';
import { Toolbar, ToolbarList } from './Toolbar';
import Button from './Button';
import Body from './Body';
import MaintenanceMode from './MaintenanceMode';
import useQuery from './hooks/useQuery';
import AuthenticationOutage, { useDetectAuthenticationOutage } from './AuthenticationOutage';

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
  const doStart = !!query.get(START_FORM_QUERY_PARAM);

  useEffect(() => {
    if (doStart) onFormStart();
  }, [doStart, onFormStart]);
};


/**
 * Form start screen.
 *
 * This is shown when the form is initially loaded and provides the explicit user
 * action to start the form, or (in the future) present the login button (DigiD,
 * eHerkenning...)
 */
const FormStart = ({ form, onFormStart }) => {
  useStartSubmission(onFormStart);

  const outagePluginId = useDetectAuthenticationOutage();

  if (form.maintenanceMode) {
    return <MaintenanceMode title={form.name} />;
  }

  if (outagePluginId) {
    const loginOption = form.loginOptions.find(option => option.identifier === outagePluginId);
    if (!loginOption) throw new Error('Unknown login plugin identifier');
    return (
      <Card title={`Probleem - ${form.name}`}>
        <AuthenticationOutage loginOption={loginOption} />
      </Card>
    );
  }

  return (
    <Card title={form.name}>

      <Body modifiers={['compact']}>Log in or start the form anonymously.</Body>

      <Toolbar modifiers={['start']}>
        <ToolbarList>
          <Button variant="primary" component="a" href="#" onClick={onFormStart}>Formulier starten</Button>
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
  form: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    loginRequired: PropTypes.bool.isRequired,
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
    product: PropTypes.object,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    maintenanceMode: PropTypes.bool.isRequired,
    steps: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      formDefinition: PropTypes.string.isRequired,
      index: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  onFormStart: PropTypes.func.isRequired,
};


export default FormStart;
