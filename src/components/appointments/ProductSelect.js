import PropTypes from 'prop-types';
import React, {useCallback, useContext} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from 'Context';
import {get} from 'api';
import {AsyncSelectField} from 'components/forms';

// TODO: replace with tanstack useQuery at some point

const CACHED_PRODUCTS_KEY = 'appointment|products';
const CACHED_PRODUCTS_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

const getProductsFromCache = () => {
  const cachedValue = window.sessionStorage.getItem(CACHED_PRODUCTS_KEY);
  if (cachedValue === null) return null;
  const {value, timestamp} = JSON.parse(cachedValue);
  // check if it's expired
  const now = new Date().getTime();
  const minTimestamp = now - CACHED_PRODUCTS_MAX_AGE_MS;
  if (timestamp < minTimestamp) {
    window.sessionStorage.removeItem(CACHED_PRODUCTS_KEY);
    return null;
  }
  return value;
};

const cacheProducts = products => {
  const now = new Date().getTime();
  const serialized = JSON.stringify({value: products, timestamp: now});
  window.sessionStorage.setItem(CACHED_PRODUCTS_KEY, serialized);
};

export const getProducts = async baseUrl => {
  let products = getProductsFromCache();
  if (products === null) {
    products = await get(`${baseUrl}appointments/products`);
    cacheProducts(products);
  }
  return products;
};

const ProductSelect = ({name}) => {
  const {baseUrl} = useContext(ConfigContext);
  const getOptions = useCallback(async () => await getProducts(baseUrl), [baseUrl]);
  return (
    <AsyncSelectField
      name={name}
      isRequired
      label={
        <FormattedMessage
          description="Appoinments: product select label"
          defaultMessage="Product"
        />
      }
      getOptions={getOptions}
      valueProperty="identifier"
      getOptionLabel={product => product.name}
      validateOnChange
    />
  );
};
ProductSelect.propTypes = {
  name: PropTypes.string.isRequired,
};
export default ProductSelect;
