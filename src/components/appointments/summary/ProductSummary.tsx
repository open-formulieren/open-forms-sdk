import {Heading3, UnorderedList, UnorderedListItem} from '@utrecht/component-library-react';
import {useContext} from 'react';
import {FormattedMessage} from 'react-intl';
import {useAsync} from 'react-use';

import {ConfigContext} from '@/Context';
import Loader from '@/components/Loader';
import type {AppointmentProduct} from '@/data/appointments';

import {getAllProducts} from '../fields/ProductSelect';

export interface ProductSummaryProps {
  products: AppointmentProduct[];
}

export const ProductSummary: React.FC<ProductSummaryProps> = ({products}) => {
  const {baseUrl} = useContext(ConfigContext);
  const {
    loading,
    value: allProducts = [],
    error,
  } = useAsync(async () => await getAllProducts(baseUrl), [baseUrl]);

  if (!products.length) return null;
  if (error) throw error;
  if (loading) {
    return <Loader modifiers={['small']} />;
  }

  const productsById = Object.fromEntries(allProducts.map(p => [p.identifier, p.name]));

  return (
    <>
      <Heading3 className="utrecht-heading-3--distanced">
        <FormattedMessage
          description="Product summary on appointments contact details step heading"
          defaultMessage="Your products"
        />
      </Heading3>
      <UnorderedList className="utrecht-unordered-list--distanced">
        {products.map(({productId, amount}, index) => (
          <UnorderedListItem key={`${productId}-${index}`}>
            <FormattedMessage
              description="Product summary on appointments contact details step"
              defaultMessage="{name}: {amount}x"
              values={{
                amount,
                name: productsById[productId],
              }}
            />
          </UnorderedListItem>
        ))}
      </UnorderedList>
    </>
  );
};
