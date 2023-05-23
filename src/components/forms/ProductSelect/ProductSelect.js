import PropTypes from 'prop-types';

import AsyncSelectField from '../SelectField/AsyncSelectField';

const ProductSelect = ({namePrefix, label, description, isRequired}) => {
  const getOptions = async () => {
    // Mocking the response
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            code: 'P1',
            identifier: 'product1',
            name: 'Product 1',
          },
          {
            code: 'P2',
            identifier: 'product2',
            name: 'Product 2',
          },
          {
            code: 'P3',
            identifier: 'product3',
            name: 'Product 3',
          },
        ]);
      }, 1000);
    });
    return response.map(({code, identifier, name}) => ({
      label: `${code} - ${name}`,
      value: identifier,
    }));
  };

  return (
    <AsyncSelectField
      optionsRetriever={getOptions}
      name={`${namePrefix}.product`}
      label={label}
      description={description}
      isRequired={isRequired}
    />
  );
};
ProductSelect.PropTypes = {
  namePrefix: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  isRequired: PropTypes.bool,
};
export default ProductSelect;
