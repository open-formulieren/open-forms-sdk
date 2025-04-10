import {FormattedMessage} from 'react-intl';

import ErrorMessage from '@/components/Errors/ErrorMessage';

const FormMaximumSubmissionsError: React.FC = () => (
  <ErrorMessage level="error">
    <FormattedMessage
      description="Maximum form submissions error message"
      defaultMessage="Unfortunately, this form is no longer available for submissions."
    />
  </ErrorMessage>
);

export default FormMaximumSubmissionsError;
