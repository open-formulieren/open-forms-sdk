import {NumberField} from '@open-formulieren/formio-renderer';
import {useContext} from 'react';
import {defineMessage, useIntl} from 'react-intl';
import type {MessageDescriptor} from 'react-intl';

import {AppointmentConfigContext} from '../Context';
import ProductSelect from './ProductSelect';

export const amountLabel: MessageDescriptor = defineMessage({
  description: 'Appointments: product amount field label',
  defaultMessage: 'Amount',
});

export interface ProductProps {
  namePrefix: string;
  index: number;
  selectedProductIds: string[];
}

const Product: React.FC<ProductProps> = ({namePrefix, index, selectedProductIds}) => {
  const intl = useIntl();
  const {supportsMultipleProducts} = useContext(AppointmentConfigContext);
  return (
    <div className="openforms-form-field-container">
      <ProductSelect
        name={`${namePrefix}[${index}].productId`}
        selectedProductIds={selectedProductIds}
      />
      <NumberField
        name={`${namePrefix}[${index}].amount`}
        label={intl.formatMessage(amountLabel)}
        isRequired
        isReadonly={!supportsMultipleProducts}
      />
    </div>
  );
};

export default Product;
