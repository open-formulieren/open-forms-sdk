import {NumberField} from '@open-formulieren/formio-renderer';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {defineMessage, useIntl} from 'react-intl';

import {AppointmentConfigContext} from '../Context';
import ProductSelect from './ProductSelect';

export const amountLabel = defineMessage({
  description: 'Appointments: product amount field label',
  defaultMessage: 'Amount',
});

const Product = ({namePrefix, index, selectedProductIds}) => {
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

Product.propTypes = {
  namePrefix: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  selectedProductIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Product;
