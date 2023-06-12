import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import {NumberField} from 'components/forms';

import ProductSelect from './ProductSelect';

const Product = ({namePrefix, index}) => (
  <div>
    <ProductSelect name={`${namePrefix}[${index}].product`} />
    <NumberField
      name={`${namePrefix}[${index}].amount`}
      label={
        <FormattedMessage
          description="Appointments: product amount field label"
          defaultMessage="Amount"
        />
      }
      isRequired
      useNumberType
      step={1}
      min={1}
    />
  </div>
);

Product.propTypes = {
  namePrefix: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default Product;
