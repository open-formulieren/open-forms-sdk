import {FormattedMessage, useIntl} from 'react-intl';

import Card from '@/components/Card';
import Link from '@/components/Link';
import type {PermissionDenied} from '@/errors';

import ErrorDetail from './ErrorDetail';
import ErrorMessage from './ErrorMessage';

export interface PermissionDeniedErrorProps {
  useCard?: boolean;
  error: PermissionDenied;
}

const PermissionDeniedError: React.FC<PermissionDeniedErrorProps> = ({error, useCard = false}) => {
  const intl = useIntl();
  const Wrapper = useCard ? Card : 'div';
  return (
    <Wrapper
      title={intl.formatMessage({
        description: "'Permission denied' error title",
        defaultMessage: 'Authentication problem',
      })}
    >
      <ErrorMessage>
        <FormattedMessage
          description="Authentication error message"
          defaultMessage="There was an authentication and/or permission problem."
        />
      </ErrorMessage>

      <ErrorDetail error={error} />

      <Link to="/">
        <FormattedMessage
          description="return to form start link after 403"
          defaultMessage="Back to form start"
        />
      </Link>
    </Wrapper>
  );
};

export default PermissionDeniedError;
