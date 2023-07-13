import PropTypes from 'prop-types';
import {defineMessage, useIntl} from 'react-intl';

import {NumberField} from 'components/forms';

import ProductSelect from './ProductSelect';

export const amountLabel = defineMessage({
  description: 'Appointments: product amount field label',
  defaultMessage: 'Amount',
});

const Product = ({namePrefix, index}) => {
  const intl = useIntl();
  return (
    <div>
      <ProductSelect name={`${namePrefix}[${index}].productId`} />
      <NumberField
        name={`${namePrefix}[${index}].amount`}
        label={intl.formatMessage(amountLabel)}
        isRequired
        useNumberType
        step={1}
        min={1}
      />
    </div>
  );
};

Product.propTypes = {
  namePrefix: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default Product;
