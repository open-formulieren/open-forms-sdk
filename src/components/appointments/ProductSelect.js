import PropTypes from 'prop-types';
import React, {useCallback, useContext} from 'react';
import {defineMessage, useIntl} from 'react-intl';

import {ConfigContext} from 'Context';
import {get} from 'api';
import {getCached, setCached} from 'cache';
import {AsyncSelectField} from 'components/forms';

const CACHED_PRODUCTS_KEY = 'appointment|products';
const CACHED_PRODUCTS_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

export const fieldLabel = defineMessage({
  description: 'Appoinments: product select label',
  defaultMessage: 'Product',
});

export const getProducts = async baseUrl => {
  let products = getCached(CACHED_PRODUCTS_KEY, CACHED_PRODUCTS_MAX_AGE_MS);
  if (products === null) {
    products = await get(`${baseUrl}appointments/products`);
    setCached(CACHED_PRODUCTS_KEY, products);
  }
  return products;
};

const ProductSelect = ({name}) => {
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const getOptions = useCallback(async () => await getProducts(baseUrl), [baseUrl]);
  return (
    <AsyncSelectField
      name={name}
      isRequired
      label={intl.formatMessage(fieldLabel)}
      getOptions={getOptions}
      valueProperty="identifier"
      getOptionLabel={product => product.name}
    />
  );
};
ProductSelect.propTypes = {
  name: PropTypes.string.isRequired,
};
export default ProductSelect;
