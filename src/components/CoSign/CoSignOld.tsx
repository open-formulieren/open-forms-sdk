import {LoadingIndicator} from '@open-formulieren/formio-renderer';
import {useContext} from 'react';
import {FormattedMessage} from 'react-intl';
import {useAsync} from 'react-use';

import {ConfigContext, SubmissionContext} from '@/Context';
import {get} from '@/api';
import Body from '@/components/Body';
import ErrorMessage from '@/components/Errors/ErrorMessage';
import LoginOptionsDisplay from '@/components/LoginOptions/LoginOptionsDisplay';
import {getLoginUrl} from '@/components/LoginOptions/utils';
import type {Form} from '@/data/forms';

/**
 * @see `#/components/schemas/SubmissionCoSignStatus` in the API spec.
 */
export interface SubmissionCoSignStatus {
  readonly coSigned: boolean;
  readonly representation: string;
}

export const getCosignStatus = async (
  baseUrl: string,
  submissionUuid: string
): Promise<SubmissionCoSignStatus> => {
  const endpoint = `${baseUrl}submissions/${submissionUuid}/co-sign`;
  return (await get<SubmissionCoSignStatus>(endpoint))!;
};

interface CoSignAuthenticationProps {
  form: Form;
  submissionUuid: string;
  authPlugin: string;
}

const CoSignAuthentication: React.FC<CoSignAuthenticationProps> = ({
  form,
  submissionUuid,
  authPlugin,
}) => {
  const loginOption = form.loginOptions.find(opt => opt.identifier === authPlugin);
  if (!loginOption) {
    return (
      <ErrorMessage>
        <FormattedMessage
          description="Co-sign auth option not available on form"
          defaultMessage="Something went wrong while presenting the login option. Please contact the municipality."
        />
      </ErrorMessage>
    );
  }

  // add the co-sign submission parameter to the login URL
  const loginUrl = getLoginUrl(loginOption, {coSignSubmission: submissionUuid});
  const modifiedLoginOption = {
    ...loginOption,
    url: loginUrl,
    label: (
      <FormattedMessage
        description="Login button label"
        defaultMessage="Login with {provider}"
        values={{provider: loginOption.label}}
      />
    ),
  };

  return (
    <LoginOptionsDisplay
      loginAsYourselfOptions={[modifiedLoginOption]}
      loginAsGemachtigdeOptions={[]}
    />
  );
};

interface NonInteractiveCosignOldProps {
  interactive?: false;
  submissionUuid?: never;
  form?: never;
  authPlugin?: never;
}

interface InteractiveCosignOldProps {
  interactive: true;
  submissionUuid: string;
  form: Form;
  authPlugin?: string;
}

type CoSignOldProps = NonInteractiveCosignOldProps | InteractiveCosignOldProps;

const CoSignOld: React.FC<CoSignOldProps> = ({...props}) => {
  const {baseUrl} = useContext(ConfigContext);
  const {submission} = useContext(SubmissionContext);

  let submissionUuid: string = props.interactive ? props.submissionUuid : '';
  if (!submissionUuid) {
    if (!submission) throw new Error('There must be a submission in the context.');
    submissionUuid = submission.id;
  }

  const state = useAsync(
    async () => await getCosignStatus(baseUrl, submissionUuid),
    [baseUrl, submissionUuid]
  );
  // log errors to the console if any
  if (state.error) console.error(state.error);
  // while loading, display spinner
  if (state.loading) return <LoadingIndicator size="small" />;

  const {coSigned, representation} = state.value ?? {coSigned: false, representation: ''};
  // Early simple exit if it's cosigned already.
  if (coSigned) {
    return (
      <Body component="div">
        <div className="openforms-co-sign__representation">
          {representation ?? (
            <FormattedMessage
              description="Co-signed without representation fallback message"
              defaultMessage="Something went wrong while processing the co-sign authentication. Please contact the municipality."
            />
          )}
        </div>
      </Body>
    );
  }

  // not yet cosigned
  if (!props.interactive) {
    return (
      <FormattedMessage
        description="Not co-signed (summary) message"
        defaultMessage="Not co-signed"
      />
    );
  }
  const {form, authPlugin = 'digid-mock'} = props;
  return (
    <CoSignAuthentication form={form} submissionUuid={submissionUuid} authPlugin={authPlugin} />
  );
};

export default CoSignOld;
export {CoSignAuthentication};
