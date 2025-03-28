import {FormattedMessage, useIntl} from 'react-intl';

import Card from '@/components/Card';

import ErrorMessage from './ErrorMessage';

export interface FormUnavailableErrorProps {
  useCard?: boolean;
}

const FormUnavailableError: React.FC<FormUnavailableErrorProps> = ({useCard = false}) => {
  const intl = useIntl();
  const Wrapper = useCard ? Card : 'div';
  return (
    <Wrapper
      title={intl.formatMessage({
        description: 'Open Forms service unavailable error title',
        defaultMessage: 'Form unavailable',
      })}
    >
      <ErrorMessage level="error">
        <FormattedMessage
          description="Open Forms service unavailable error message"
          defaultMessage="Unfortunately, this form is currently unavailable due to an outage. Please try again later."
        />
      </ErrorMessage>
    </Wrapper>
  );
};

export default FormUnavailableError;
