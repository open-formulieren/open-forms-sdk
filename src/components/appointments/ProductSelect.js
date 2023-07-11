import PropTypes from 'prop-types';
import React, {useCallback, useContext} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from 'Context';
import {get} from 'api';
import {AsyncSelectField} from 'components/forms';

// TODO: we should cache this in a more transient scope
let products = null;

export const getProducts = async baseUrl => {
  if (products === null) {
    products = await get(`${baseUrl}appointments/products`);
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
