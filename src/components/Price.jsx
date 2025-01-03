import PropTypes from 'prop-types';
import {FormattedMessage, FormattedNumber} from 'react-intl';

import {getBEMClassName} from 'utils';

const Price = ({price = ''}) => {
  return (
    <div className={getBEMClassName('price')}>
      <div className={getBEMClassName('price__label')}>
        <FormattedMessage description="Label for the total price to pay" defaultMessage="Total" />:
      </div>
      <div className={getBEMClassName('price__amount')}>
        <FormattedNumber
          value={price}
          style="currency"
          currency="EUR"
          minimumFractionDigits={2}
          maximumFractionDigits={2}
        />
      </div>
    </div>
  );
};

Price.propTypes = {
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Price;
