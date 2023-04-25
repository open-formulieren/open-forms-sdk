import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
import {FormattedMessage} from 'react-intl';

import Body from 'components/Body';
import Card from 'components/Card';
import ExistingSubmissionOptions from 'components/ExistingSubmissionOptions';
import {LiteralsProvider} from 'components/Literal';
import Loader from 'components/Loader';
import LoginOptions from 'components/LoginOptions';
import MaintenanceMode from 'components/MaintenanceMode';
import {
  AuthenticationErrors,
  useDetectAuthErrorMessages,
} from 'components/auth/AuthenticationErrors';
import AuthenticationOutage, {
  useDetectAuthenticationOutage,
} from 'components/auth/AuthenticationOutage';
import {UnprocessableEntity} from 'errors';
import {IsFormDesigner} from 'headers';
import useStartSubmission from 'hooks/useStartSubmission';
import useTitle from 'hooks/useTitle';
import Types from 'types';
import {getBEMClassName} from 'utils';

const FormStartMessage = ({form}) => {
  return (
    <Body component="div">
      <div
        className={getBEMClassName('body', ['wysiwyg'])}
        dangerouslySetInnerHTML={{__html: form.explanationTemplate}}
      />
    </Body>
  );
};

/**
 * Form start screen.
 *
 * This is shown when the form is initially loaded and provides the explicit user
 * action to start the form, or present the login button (DigiD, eHerkenning...)
 */
const FormStart = ({form, hasActiveSubmission, onFormStart}) => {
  const doStart = useStartSubmission();
  const outagePluginId = useDetectAuthenticationOutage();
  const authErrors = useDetectAuthErrorMessages();
  const [error, setError] = useState(null);
  const hasAuthErrors = !!outagePluginId || !!authErrors;

  const onFormStartCalledRef = useRef(false);

  useTitle(form.name);

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
    };

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

  if (!form.active) {
    throw new UnprocessableEntity('Unprocessable Entity', 422, 'Form not active', 'form-inactive');
  }

  const userIsFormDesigner = IsFormDesigner.getValue();
  if (!userIsFormDesigner && form.maintenanceMode) {
    return <MaintenanceMode title={form.name} />;
  }

  if (outagePluginId) {
    const loginOption = form.loginOptions.find(option => option.identifier === outagePluginId);
    if (!loginOption) throw new Error('Unknown login plugin identifier');
    return (
      <Card
        title={
          <FormattedMessage
            description="Form start outage title"
            defaultMessage="Problem - {formName}"
            values={{formName: form.name}}
          />
        }
      >
        <AuthenticationOutage loginOption={loginOption} />
      </Card>
    );
  }

  return (
    <LiteralsProvider literals={form.literals}>
      <Card title={form.name}>
        {userIsFormDesigner && form.maintenanceMode && <MaintenanceMode asToast />}

        {!!authErrors ? <AuthenticationErrors parameters={authErrors} /> : null}

        <FormStartMessage form={form} />

        {hasActiveSubmission ? (
          <ExistingSubmissionOptions form={form} />
        ) : (
          <LoginOptions form={form} onFormStart={onFormStart} />
        )}
      </Card>
    </LiteralsProvider>
  );
};

FormStart.propTypes = {
  form: Types.Form.isRequired,
  onFormStart: PropTypes.func.isRequired,
};

export default FormStart;
