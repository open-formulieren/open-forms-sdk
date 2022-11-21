import React from 'react';
import PropTypes from 'prop-types';
import {Link, useLocation} from 'react-router-dom';
import {FormattedMessage, defineMessage, useIntl} from 'react-intl';

import Body from 'components/Body';
import Anchor from 'components/Anchor';
import Card from 'components/Card';
import ErrorMessage from 'components/ErrorMessage';

// see openforms.payments.constants.UserAction in the backend
const USER_ACTIONS = ['accept', 'exception', 'cancel', 'unknown'];

// see openforms.payments.constants.PaymentStatus in the backend
const STATUS_MESSAGES = {
  started: defineMessage({
    description: 'payment started status',
    defaultMessage: "You've started the payment process.",
  }),
  processing: defineMessage({
    description: 'payment processing status',
    defaultMessage: 'Your payment is currently processing.',
  }),
  failed: defineMessage({
    description: 'payment failed status',
    defaultMessage:
      'The payment has failed. If you aborted the payment, please complete payment from the confirmation email.',
  }),
  completed: defineMessage({
    description: 'payment completed status',
    defaultMessage: 'Your payment has been received.',
  }),
  registered: defineMessage({
    description: 'payment registered status',
    defaultMessage: 'Your payment is received and processed.',
  }),
};

const Container = ({children}) => (
  <Card
    title={
      <FormattedMessage description="Payment overview title" defaultMessage="Payment overview" />
    }
  >
    {children}
  </Card>
);

Container.propTypes = {
  children: PropTypes.node,
};

const PaymentOverview = () => {
  const intl = useIntl();
  const {state: {status, userAction} = {}} = useLocation();

  // display a warning if someone navigates directly to this URL.
  if (!status || !userAction) {
    return (
      <Container>
        <ErrorMessage>
          <FormattedMessage
            description="Payment overview missing state error message"
            defaultMessage="We can't display any payment information - did you maybe get here by accident?"
          />
        </ErrorMessage>
      </Container>
    );
  }

  if (!USER_ACTIONS.includes(userAction)) {
    throw new Error('Unknown payment user action');
  }

  const statusMsg = STATUS_MESSAGES[status];
  if (!statusMsg) {
    throw new Error('Unknown payment status');
  }

  let Wrapper = React.Fragment;
  if (status === 'failed') {
    Wrapper = ErrorMessage;
  }

  return (
    <Container>
      <Body component="div">
        <Wrapper>{intl.formatMessage(statusMsg)}</Wrapper>
      </Body>

      <Link to="/" component={Anchor}>
        <FormattedMessage
          description="return to form start button"
          defaultMessage="Back to form start"
        />
      </Link>
    </Container>
  );
};

PaymentOverview.propTypes = {};

export default PaymentOverview;
