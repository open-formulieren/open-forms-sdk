import {FormattedMessage} from 'react-intl';
import {useSearchParams} from 'react-router';

import ErrorMessage from '@/components/Errors/ErrorMessage';
import type {FormLoginOption} from '@/data/forms';

const AUTHENTICATION_OUTAGE_QUERY_PARAM = 'of-auth-problem';

export const useDetectAuthenticationOutage = (): string | null => {
  const [params] = useSearchParams();
  return params.get(AUTHENTICATION_OUTAGE_QUERY_PARAM);
};

export interface AuthenticationOutageProps {
  loginOption: FormLoginOption;
}

const AuthenticationOutage: React.FC<AuthenticationOutageProps> = ({loginOption}) => (
  <ErrorMessage>
    <FormattedMessage
      description="Authentication outage message"
      defaultMessage={`
          This form cannot be used temporarily due to a malfunction with {label}.
          Please try again later.`}
      values={{label: loginOption.label}}
    />
  </ErrorMessage>
);

export default AuthenticationOutage;
