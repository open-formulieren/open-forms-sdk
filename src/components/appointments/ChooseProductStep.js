import {FieldArray, useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import Product from './Product';

const ChooseProductStep = () => {
  const {values} = useFormikContext();
  const products = values?.products || [];
  return (
    <FieldArray name="products">
      {arrayHelpers => (
        <>
          {products.map(({product: productId}, index) => (
            // blank blocks don't have a product selected yet -> so the index is added
            // to make the key guaranteed unique
            <div key={`${productId}-${index}`}>
              <Product namePrefix="products" index={index} />
            </div>
          ))}
        </>
      )}
    </FieldArray>
  );
};

ChooseProductStep.propTypes = {};

export default ChooseProductStep;
