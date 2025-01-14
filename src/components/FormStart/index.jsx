import {useCallback, useContext, useRef} from 'react';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';
import {useAsync} from 'react-use';

import {ConfigContext} from 'Context';
import Body from 'components/Body';
import Card from 'components/Card';
import ExistingSubmissionOptions from 'components/ExistingSubmissionOptions';
import {useSubmissionContext} from 'components/Form';
import FormMaximumSubmissions from 'components/FormMaximumSubmissions';
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
import {createSubmission} from 'data/submissions';
import {UnprocessableEntity} from 'errors';
import {IsFormDesigner} from 'headers';
import useFormContext from 'hooks/useFormContext';
import useInitialDataReference from 'hooks/useInitialDataReference';
import useStartSubmission from 'hooks/useStartSubmission';
import useTitle from 'hooks/useTitle';
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
const FormStart = () => {
  const {baseUrl, clientBaseUrl} = useContext(ConfigContext);
  const {initialDataReference} = useInitialDataReference();
  const navigate = useNavigate();

  const form = useFormContext();
  const {submission, onSubmissionObtained, onDestroySession} = useSubmissionContext();

  const hasActiveSubmission = !!submission;
  const isAuthenticated = hasActiveSubmission && submission.isAuthenticated;

  const doStart = useStartSubmission();
  const outagePluginId = useDetectAuthenticationOutage();
  const authErrors = useDetectAuthErrorMessages();
  const hasAuthErrors = !!outagePluginId || !!authErrors;

  const onFormStartCalledRef = useRef(false);

  useTitle(form.name);

  /**
   * Callback invoked when a form submission must be started.
   *
   * It can be triggered by an HTML form submission for anonymous submissions, or
   * automatically because of a magical parameter being present in the URL query params.
   *
   * It must be wrapped in useCallback, since onFormStart is passed as a dependency to
   * useAsync.
   *
   * @return {Promise<Void>} Triggers side effects and state updates.
   */
  const onFormStart = useCallback(
    async (options = {}) => {
      const {isAnonymous = false} = options;
      if (submission !== null) throw new Error('There already is a submission!');

      const newSubmission = await createSubmission(
        baseUrl,
        form,
        clientBaseUrl,
        null,
        initialDataReference,
        isAnonymous
      );

      onSubmissionObtained(newSubmission);

      const firstStepRoute = `/stap/${form.steps[0].slug}`;
      navigate(firstStepRoute);
    },
    [submission, baseUrl, form, clientBaseUrl, initialDataReference, onSubmissionObtained, navigate]
  );

  const {error} = useAsync(async () => {
    // if it's already called, do not call it again as this creates 'infinite' cycles.
    // This component is re-mounted/re-rendered because of parent component state changes,
    // while the start marker is still in the querystring. Therefore, once we have called
    // the callback, we keep track of this call being done so that it's invoked only once.
    // See https://github.com/open-formulieren/open-forms/issues/1174
    if (onFormStartCalledRef.current) {
      return;
    }

    if (doStart && !hasAuthErrors) {
      onFormStartCalledRef.current = true;
      await onFormStart();
    }
  }, [doStart, hasAuthErrors, onFormStart]);
  if (error) throw error;

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

  const extraNextParams = initialDataReference
    ? {initial_data_reference: initialDataReference}
    : {};

  return (
    <LiteralsProvider literals={form.literals}>
      <Card title={form.name}>
        {form.submissionLimitReached ? <FormMaximumSubmissions /> : null}
        {userIsFormDesigner && form.maintenanceMode && <MaintenanceMode asToast />}

        {authErrors ? <AuthenticationErrors parameters={authErrors} /> : null}

        <FormStartMessage form={form} />

        {hasActiveSubmission ? (
          <ExistingSubmissionOptions
            form={form}
            onDestroySession={onDestroySession}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          <LoginOptions
            // if cosign allows links in emails, we don't need to display the cosign
            // login options, so strip them out
            form={form.cosignHasLinkInEmail ? {...form, cosignLoginOptions: []} : form}
            onFormStart={onFormStart}
            extraNextParams={extraNextParams}
          />
        )}
      </Card>
    </LiteralsProvider>
  );
};

FormStart.propTypes = {};

export default FormStart;
