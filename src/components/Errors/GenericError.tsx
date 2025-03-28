import {FormattedMessage, useIntl} from 'react-intl';

import Card from '@/components/Card';

import ErrorDetail from './ErrorDetail';
import ErrorMessage from './ErrorMessage';
import type {AnyError} from './types';

export interface GenericErrorProps {
  useCard?: boolean;
  error: AnyError;
}

const GenericError: React.FC<GenericErrorProps> = ({error, useCard = false}) => {
  const intl = useIntl();
  const Wrapper = useCard ? Card : 'div';
  return (
    <Wrapper
      title={intl.formatMessage({
        description: 'Error boundary title',
        defaultMessage: 'Oops!',
      })}
    >
      <ErrorMessage>
        <FormattedMessage
          description="Generic error message"
          defaultMessage="Unfortunately something went wrong!"
        />
      </ErrorMessage>
      <ErrorDetail error={error} />
    </Wrapper>
  );
};

export default GenericError;
