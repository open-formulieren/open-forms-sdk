import {useAsync} from 'react-use';

import {post} from '@/api';
import Loader from '@/components/Loader';
import type {PaymentInfo} from '@/data/payment';

import PaymentForm from './PaymentForm';

const getStartPaymentUrl = (apiUrl: string): string => {
  const nextUrl = new URL(window.location.href);
  const startPaymentUrl = new URL(apiUrl);
  startPaymentUrl.searchParams.set('next', nextUrl.toString());
  return startPaymentUrl.toString();
};

export interface StartPaymentProps {
  /**
   * The payment start URL received from the backend.
   */
  startUrl: string;
}

/**
 * Given a start URL, fetches the payment start information and renders the UI controls
 * to enter the payment flow.
 */
const StartPayment: React.FC<StartPaymentProps> = ({startUrl}) => {
  const fullUrl = getStartPaymentUrl(startUrl);

  const {loading, value} = useAsync(async () => (await post<PaymentInfo>(fullUrl)).data, [fullUrl]);

  if (loading) {
    return <Loader modifiers={['centered']} />;
  }

  return (
    <>
      {value && (
        <PaymentForm method={value.type} url={value.url} data={value.data} autoSubmit={false} />
      )}
    </>
  );
};

export {StartPayment};
