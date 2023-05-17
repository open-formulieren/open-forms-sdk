import PropTypes from 'prop-types';

import NumberField from '../forms/NumberField/NumberField';
import ProductSelect from '../forms/ProductSelect/ProductSelect';

const AppointmentProduct = ({namePrefix}) => {
  return (
    <>
      <ProductSelect namePrefix={`${namePrefix}.product`} />
      <NumberField name={`${namePrefix}.amount`} step={1} min={1} />
    </>
  );
};

AppointmentProduct.propTypes = {
  namePrefix: PropTypes.string.isRequired,
};
export default AppointmentProduct;
