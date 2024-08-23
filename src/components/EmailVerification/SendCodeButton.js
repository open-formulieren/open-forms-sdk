import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import {OFButton} from 'components/Button';
import Loader from 'components/Loader';

const SendCodeButton = ({isSending, onSendCode}) => (
  <OFButton
    type="button"
    appearance="primary-action-button"
    onClick={onSendCode}
    disabled={isSending}
  >
    {isSending ? (
      <Loader modifiers={['centered', 'only-child', 'small', 'gray']} />
    ) : (
      <FormattedMessage
        description="Email verification: send code button text"
        defaultMessage="Send code"
      />
    )}
  </OFButton>
);

SendCodeButton.propTypes = {
  isSending: PropTypes.bool.isRequired,
  onSendCode: PropTypes.func.isRequired,
};

export default SendCodeButton;
