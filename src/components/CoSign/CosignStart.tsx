import {FormattedMessage} from 'react-intl';

import Body from '@/components/Body';
import FormContainer from '@/components/FormContainer';
import {LiteralsProvider} from '@/components/Literal';
import LoginOptions from '@/components/LoginOptions';
import MaintenanceMode from '@/components/MaintenanceMode';
import {AuthenticationError, useDetectAuthErrorMessage} from '@/components/auth';
import AuthenticationOutage, {
  useDetectAuthenticationOutage,
} from '@/components/auth/AuthenticationOutage';
import {UnprocessableEntity} from '@/errors';
import {IsFormDesigner} from '@/headers';
import useFormContext from '@/hooks/useFormContext';

const CosignStart: React.FC = () => {
  const form = useFormContext();

  const outagePluginId = useDetectAuthenticationOutage();
  const authError = useDetectAuthErrorMessage();

  if (!form.active) {
    throw new UnprocessableEntity('Unprocessable Entity', 422, 'Form not active', 'form-inactive');
  }

  const userIsFormDesigner = IsFormDesigner.getValue();
  if (!userIsFormDesigner && form.maintenanceMode) {
    return <MaintenanceMode />;
  }

  if (outagePluginId) {
    const loginOption = form.cosignLoginOptions.find(
      option => option.identifier === outagePluginId
    );
    if (!loginOption) throw new Error('Unknown login plugin identifier');
    return (
      <FormContainer
        title={
          <FormattedMessage
            description="Form start outage title"
            defaultMessage="Problem - {formName}"
            values={{formName: form.name}}
          />
        }
      >
        <AuthenticationOutage loginOption={loginOption} />
      </FormContainer>
    );
  }

  return (
    <LiteralsProvider literals={form.literals}>
      <FormContainer>
        {userIsFormDesigner && form.maintenanceMode && <MaintenanceMode asToast />}

        {authError && <AuthenticationError parameter={authError[0]} errorCode={authError[1]} />}

        <Body>
          <FormattedMessage
            description="Cosign start explanation message"
            defaultMessage={`Did you receive an email with a request to cosign?
            Start the cosigning by logging in.`}
          />
        </Body>

        <LoginOptions
          // hide the normal login options, and only display the cosign login options
          form={{...form, loginOptions: [], loginRequired: true}}
          // dummy - we don't actually start a new submission, but the next URL is baked
          // into the login URLs.
          onFormStart={() => {}}
          isolateCosignOptions={false}
        />
      </FormContainer>
    </LiteralsProvider>
  );
};

export default CosignStart;
