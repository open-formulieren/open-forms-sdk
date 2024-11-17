import PropTypes from 'prop-types';
import React from 'react';
import {useAsync} from 'react-use';

import {post} from 'api';
import Loader from 'components/Loader';

import PaymentForm from './PaymentForm';

const getStartPaymentUrl = apiUrl => {
  const nextUrl = new URL(window.location.href);
  const startPaymentUrl = new URL(apiUrl);
  startPaymentUrl.searchParams.set('next', nextUrl.toString());
  return startPaymentUrl.toString();
};

/**
 * Given a start URL, fetches the payment start information and renders the UI controls
 * to enter the payment flow.
 * @param  {String} startUrl The payment start URL received from the backend.
 * @return {JSX}
 */
const StartPayment = ({startUrl}) => {
  const fullUrl = getStartPaymentUrl(startUrl);

  const {loading, value} = useAsync(async () => {
    const resp = await post(fullUrl);
    if (!resp.ok) throw new Error('Could not start payment');
    return resp.data;
  }, [fullUrl]);

  if (loading) {
    return <Loader modifiers={['centered']} />;
  }

  return (
    <>
      {value ? (
        <PaymentForm method={value.type} url={value.url} data={value.data} autoSubmit={false} />
      ) : null}
    </>
  );
};

StartPayment.propTypes = {
  startUrl: PropTypes.string.isRequired,
};

export {StartPayment};
