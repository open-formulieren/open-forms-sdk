import {useFormikContext} from 'formik';
import {useCallback, useContext} from 'react';
import {defineMessage, useIntl} from 'react-intl';
import type {MessageDescriptor} from 'react-intl';

import {ConfigContext} from '@/Context';
import {get} from '@/api';
import {getCached, setCached} from '@/cache';
import AsyncSelectField from '@/components/forms/SelectField/AsyncSelectField';
import type {Product} from '@/data/appointments';

const CACHED_PRODUCTS_KEY = 'appointment|all-products';
const CACHED_PRODUCTS_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

export const fieldLabel: MessageDescriptor = defineMessage({
  description: 'Appoinments: product select label',
  defaultMessage: 'Product',
});

export const getAllProducts = async (baseUrl: string): Promise<Product[]> => {
  let products: Product[] | null = getCached<Product[]>(
    CACHED_PRODUCTS_KEY,
    CACHED_PRODUCTS_MAX_AGE_MS
  );
  if (products === null) {
    products = (await get<Product[]>(`${baseUrl}appointments/products`))!;
    setCached<Product[]>(CACHED_PRODUCTS_KEY, products);
  }
  return products;
};

const getProducts = async (
  baseUrl: string,
  selectedProductIds: string[],
  currentProductId: string
): Promise<Product[]> => {
  const otherProductIds = selectedProductIds.filter(
    productId => productId && productId !== currentProductId
  );
  if (!otherProductIds.length) {
    return await getAllProducts(baseUrl);
  }

  const uniqueIds = [...new Set(otherProductIds)].sort();
  const cacheKey = `appointments|products|${uniqueIds.join(';')}`;
  let products: Product[] | null = getCached<Product[]>(cacheKey, CACHED_PRODUCTS_MAX_AGE_MS);
  if (products === null) {
    const multiParams = uniqueIds.map(id => ({product_id: id}));
    products = (await get<Product[]>(`${baseUrl}appointments/products`, {}, multiParams))!;
    // only allow products that aren't selected yet, as these should use the amount
    // field to order multiple.
    products = products.filter(p => !uniqueIds.includes(p.identifier));
    setCached<Product[]>(cacheKey, products);
  }
  return products;
};

export interface ProductSelectProps {
  name: string;
  selectedProductIds: string[];
}

const ProductSelect: React.FC<ProductSelectProps> = ({name, selectedProductIds}) => {
  const {getFieldProps} = useFormikContext();
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const {value} = getFieldProps(name);
  const getOptions = useCallback(
    async () => {
      const products = await getProducts(baseUrl, selectedProductIds, value);
      return products.map(product => ({
        value: product.identifier,
        label: product.name,
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseUrl, JSON.stringify(selectedProductIds), value]
  );
  return (
    <AsyncSelectField
      name={name}
      isRequired
      label={intl.formatMessage(fieldLabel)}
      getOptions={getOptions}
    />
  );
};

export default ProductSelect;
