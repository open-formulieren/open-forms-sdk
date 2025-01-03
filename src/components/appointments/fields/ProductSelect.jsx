import {useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import {useCallback, useContext} from 'react';
import {defineMessage, useIntl} from 'react-intl';

import {ConfigContext} from 'Context';
import {get} from 'api';
import {getCached, setCached} from 'cache';
import {AsyncSelectField} from 'components/forms';

const CACHED_PRODUCTS_KEY = 'appointment|all-products';
const CACHED_PRODUCTS_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

export const fieldLabel = defineMessage({
  description: 'Appoinments: product select label',
  defaultMessage: 'Product',
});

export const getAllProducts = async baseUrl => {
  let products = getCached(CACHED_PRODUCTS_KEY, CACHED_PRODUCTS_MAX_AGE_MS);
  if (products === null) {
    products = await get(`${baseUrl}appointments/products`);
    setCached(CACHED_PRODUCTS_KEY, products);
  }
  return products;
};

const getProducts = async (baseUrl, selectedProductIds, currentProductId) => {
  const otherProductIds = selectedProductIds.filter(
    productId => productId && productId !== currentProductId
  );
  if (!otherProductIds.length) {
    return await getAllProducts(baseUrl);
  }

  const uniqueIds = [...new Set(otherProductIds)].sort();
  const cacheKey = `appointments|products|${uniqueIds.join(';')}`;
  let products = getCached(cacheKey, CACHED_PRODUCTS_MAX_AGE_MS);
  if (products === null) {
    const multiParams = uniqueIds.map(id => ({product_id: id}));
    products = await get(`${baseUrl}appointments/products`, {}, multiParams);
    // only allow products that aren't selected yet, as these should use the amount
    // field to order multiple.
    products = products.filter(p => !uniqueIds.includes(p.identifier));
    setCached(cacheKey, products);
  }
  return products;
};

const ProductSelect = ({name, selectedProductIds}) => {
  const {getFieldProps} = useFormikContext();
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const {value} = getFieldProps(name);
  const getOptions = useCallback(
    async () => await getProducts(baseUrl, selectedProductIds, value),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseUrl, JSON.stringify(selectedProductIds), value]
  );
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
  selectedProductIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default ProductSelect;
