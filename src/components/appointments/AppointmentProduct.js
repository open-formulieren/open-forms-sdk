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
  selectRequired = false,
  numberRequired = false,
}) => {
  const selectProps = {
    namePrefix: `${namePrefix}.product`,
    label: selectLabel,
    description: selectDescription,
    isRequired: selectRequired,
  };

  const numberProps = {
    namePrefix: `${namePrefix}.amount`,
    name: `${namePrefix}.amount`,
    label: numberLabel,
    description: numberDescription,
    step: 1,
    min: 1,
    isRequired: numberRequired,
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
  selectRequired: PropTypes.bool,
  numberRequired: PropTypes.bool,
};
export default AppointmentProduct;
