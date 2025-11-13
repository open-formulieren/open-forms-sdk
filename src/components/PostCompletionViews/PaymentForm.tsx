import {PrimaryActionButton} from '@open-formulieren/formio-renderer';
import {useEffect, useRef} from 'react';
import {FormattedMessage} from 'react-intl';

const AUTOSUBMIT_AFTER = 5000;

export interface PaymentFormProps {
  /**
   * The HTTP method to use.
   */
  method: 'post' | 'get';
  /**
   * The form submit URL. The form data gets submitted to this URL.
   */
  url: string;
  /**
   * The form data as an object of key-value pairs
   */
  data: Record<string, string>;
  /**
   * Whether to submit the form when it's rendered, after a fixed timeout.
   */
  autoSubmit?: boolean;
}

/**
 * Renders a plain old HTML form to submit/start the payment.
 */
const PaymentForm: React.FC<PaymentFormProps> = ({method, url, data, autoSubmit = true}) => {
  // hooks to automatically submit the payment form
  const formRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    if (!autoSubmit) return;
    const form = formRef.current;
    if (!form) return;
    window.setTimeout(() => form.submit(), AUTOSUBMIT_AFTER);
  }, [formRef, autoSubmit]);

  const dataFields = Object.entries(data).map(([key, value]) => (
    <input key={key} type="hidden" name={key} value={value} />
  ));

  return (
    <form ref={formRef} method={method} action={url}>
      {dataFields}
      <PrimaryActionButton type="submit">
        <FormattedMessage description="Start payment button" defaultMessage="Pay now" />
      </PrimaryActionButton>
    </form>
  );
};

export default PaymentForm;
