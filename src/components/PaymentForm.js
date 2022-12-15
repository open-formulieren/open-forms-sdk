import PropTypes from 'prop-types';
import React, {useEffect, useRef} from 'react';
import {FormattedMessage} from 'react-intl';

import Button from 'components/Button';

const AUTOSUBMIT_AFTER = 5000;

/**
 * Renders a plain old HTML form to submit/start the payment.
 * @param  {String} method The HTTP method to use (get or post)
 * @param  {String} url The form submit URL
 * @param  {String} data The form data as an object of key-value pairs
 * @param  {Boolean} autoSubmit Whether to submit the form when it's rendered, after
     a static timeout.
 * @return {JSX}
 */
const PaymentForm = ({method, url, data, autoSubmit = true}) => {
  // hooks to automatically submit the payment form
  const formRef = useRef();
  useEffect(() => {
    if (!autoSubmit) return;
    if (!formRef.current) return;
    window.setTimeout(() => formRef.current.submit(), AUTOSUBMIT_AFTER);
  }, [formRef, autoSubmit]);

  const dataFields = Object.entries(data).map(([key, value]) => (
    <input key={key} type="hidden" name={key} value={value} />
  ));

  return (
    <form ref={formRef} method={method} action={url}>
      {dataFields}
      <Button type="submit" variant="primary">
        <FormattedMessage description="Start payment button" defaultMessage="Pay now" />
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
