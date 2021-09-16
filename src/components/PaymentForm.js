import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import Button from 'components/Button';

const AUTOSUBMIT_AFTER = 5000;


/**
 * Renders a plain old HTML form to submit/start the payment.
 * @param  {String} options.method The HTTP method to use (get or post)
 * @return {JSX}
 */
const PaymentForm = ({ method, url, data, autoSubmit=true }) => {
  // hooks to automatically submit the payment form
  const formRef = useRef();
  useEffect(
    () => {
      if (!autoSubmit) return;
      if (!formRef.current) return;
      window.setTimeout(
        () => formRef.current.submit(),
        AUTOSUBMIT_AFTER,
      );
    },
    [formRef, autoSubmit]
  );

  const dataFields = Object.entries(data).map(([key, value]) => (
    <input key={key} type="hidden" name={key} value={value} />
  ));

  return (
    <form ref={formRef} method={method} action={url}>
      {dataFields}
      <Button type="submit" variant="primary">
        <FormattedMessage
          id="PaymentForm.button.startPayment"
          description="Start payment button"
          defaultMessage="Pay now"
        />
      </Button>
    </form>
  );
};

PaymentForm.propTypes = {
  method: PropTypes.oneOf(['post', 'get']),
  url: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.string).isRequired,
  autoSubmit: PropTypes.bool,
};


export default PaymentForm;
