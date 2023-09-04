import PropTypes from 'prop-types';
import {useContext} from 'react';
import {defineMessage, useIntl} from 'react-intl';

import {NumberField} from 'components/forms';

import {AppointmentConfigContext} from '../Context';
import {ProductsType} from '../types';
import ProductSelect from './ProductSelect';

export const amountLabel = defineMessage({
  description: 'Appointments: product amount field label',
  defaultMessage: 'Amount',
});

const Product = ({namePrefix, index, selectedProducts}) => {
  const intl = useIntl();
  const {supportsMultipleProducts} = useContext(AppointmentConfigContext);
  return (
    <div>
      <ProductSelect
        name={`${namePrefix}[${index}].productId`}
        selectedProducts={selectedProducts}
      />
      <NumberField
        name={`${namePrefix}[${index}].amount`}
        label={intl.formatMessage(amountLabel)}
        isRequired
        useNumberType
        step={1}
        min={1}
        readOnly={!supportsMultipleProducts}
      />
    </div>
  );
};

Product.propTypes = {
  namePrefix: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  selectedProducts: ProductsType.isRequired,
};

export default Product;
