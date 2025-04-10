import {FormattedMessage, useIntl} from 'react-intl';

import Card from '@/components/Card';

import ErrorMessage from './ErrorMessage';

export interface FormDeactivatedErrorProps {
  useCard?: boolean;
}

const FormDeactivatedError: React.FC<FormDeactivatedErrorProps> = ({useCard = false}) => {
  const intl = useIntl();
  const Wrapper = useCard ? Card : 'div';
  return (
    <Wrapper
      title={intl.formatMessage({
        description: "'Deactivated form' error title",
        defaultMessage: 'Sorry - this form is no longer available',
      })}
    >
      <ErrorMessage>
        <FormattedMessage
          description="Deactivated form error message"
          defaultMessage="Unfortunately, this form is no longer in use. We apologise for any inconveniences."
        />
      </ErrorMessage>
    </Wrapper>
  );
};

export default FormDeactivatedError;
