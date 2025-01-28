import {FormattedMessage, useIntl} from 'react-intl';

import ErrorMessage from 'components/Errors/ErrorMessage';

const FormUnavailable = ({wrapper: Wrapper}) => {
  const intl = useIntl();
  // Wrapper may be a DOM element, which can't handle <FormattedMessage />
  const title = intl.formatMessage({
    description: 'Open Forms service unavailable error title',
    defaultMessage: 'Form unavailable',
  });
  return (
    <Wrapper title={title}>
      <ErrorMessage modifier="error">
        <FormattedMessage
          description="Open Forms service unavailable error message"
          defaultMessage="Unfortunately, this form is currently unavailable due to an outage. Please try again later."
        />
      </ErrorMessage>
    </Wrapper>
  );
};

export default FormUnavailable;
