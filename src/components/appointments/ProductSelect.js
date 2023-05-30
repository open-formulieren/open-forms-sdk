import PropTypes from 'prop-types';
import React, {useCallback, useContext} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from 'Context';
import {get} from 'api';
import {AsyncSelectField} from 'components/forms';

const getProducts = async baseUrl => {
  const productList = await get(`${baseUrl}appointments/products`);
  return productList;
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
    />
  );
};
ProductSelect.propTypes = {
  name: PropTypes.string.isRequired,
};
export default ProductSelect;
