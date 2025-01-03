import {FormattedMessage} from 'react-intl';

import Body from 'components/Body';
import Card from 'components/Card';
import {LiteralsProvider} from 'components/Literal';
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
import useFormContext from 'hooks/useFormContext';

const CosignStart = () => {
  const form = useFormContext();

  const outagePluginId = useDetectAuthenticationOutage();
  const authErrors = useDetectAuthErrorMessages();

  if (!form.active) {
    throw new UnprocessableEntity('Unprocessable Entity', 422, 'Form not active', 'form-inactive');
  }

  const userIsFormDesigner = IsFormDesigner.getValue();
  if (!userIsFormDesigner && form.maintenanceMode) {
    return <MaintenanceMode title={form.name} />;
  }

  if (outagePluginId) {
    const loginOption = form.cosignLoginOptions.find(
      option => option.identifier === outagePluginId
    );
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

        {authErrors ? <AuthenticationErrors parameters={authErrors} /> : null}

        <Body>
          <FormattedMessage
            description="Cosign start explanation message"
            defaultMessage={`Did you receive an email with a request to cosign?
            Start the cosigning by logging in.`}
          />
        </Body>

        <LoginOptions
          // hide the normal login options, and only display the cosign login options
          form={{...form, loginOptions: []}}
          // dummy - we don't actually start a new submission, but the next URL is baked
          // into the login URLs.
          onFormStart={() => {}}
          isolateCosignOptions={false}
        />
      </Card>
    </LiteralsProvider>
  );
};

export default CosignStart;
