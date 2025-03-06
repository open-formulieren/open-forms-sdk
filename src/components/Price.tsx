import {FormattedMessage, FormattedNumber} from 'react-intl';

import {getBEMClassName} from '@/utils';

export interface PriceProps {
  price?: string | number; // the API serializes decimals to strings to not lose precision
}

const Price: React.FC<PriceProps> = ({price = '0'}) => {
  return (
    <div className={getBEMClassName('price')}>
      <div className={getBEMClassName('price__label')}>
        <FormattedMessage description="Label for the total price to pay" defaultMessage="Total" />:
      </div>
      <div className={getBEMClassName('price__amount')}>
        <FormattedNumber
          value={typeof price === 'number' ? price : parseFloat(price)}
          style="currency"
          currency="EUR"
          minimumFractionDigits={2}
          maximumFractionDigits={2}
        />
      </div>
    </div>
  );
};

export default Price;
