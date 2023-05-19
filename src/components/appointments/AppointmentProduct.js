import {Paragraph} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';

import NumberField from '../forms/NumberField/NumberField';
import ProductSelect from '../forms/ProductSelect/ProductSelect';

const AppointmentProduct = ({
  namePrefix,
  selectLabel = '',
  numberLabel = '',
  selectDescription = '',
  numberDescription = '',
}) => {
  const selectProps = {
    namePrefix: `${namePrefix}.product`,
    label: selectLabel,
    description: selectDescription,
  };

  const numberProps = {
    namePrefix: `${namePrefix}.amount`,
    name: `${namePrefix}.amount`,
    label: numberLabel,
    description: numberDescription,
    step: 1,
    min: 1,
  };
  return (
    <>
      <Paragraph>
        <ProductSelect {...selectProps} />
      </Paragraph>
      <Paragraph>
        <NumberField {...numberProps} />
      </Paragraph>
    </>
  );
};

AppointmentProduct.propTypes = {
  namePrefix: PropTypes.string.isRequired,
  selectLabel: PropTypes.string,
  numberLabel: PropTypes.string,
  selectDescription: PropTypes.string,
  numberDescription: PropTypes.string,
};
export default AppointmentProduct;
