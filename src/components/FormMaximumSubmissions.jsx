import {FormattedMessage} from 'react-intl';

import ErrorMessage from 'components/Errors/ErrorMessage';

const FormMaximumSubmissions = () => {
  return (
    <ErrorMessage level="error">
      <FormattedMessage
        description="Maximum form submissions error message"
        defaultMessage="Unfortunately, this form is no longer available for submissions."
      />
    </ErrorMessage>
  );
};

export default FormMaximumSubmissions;
