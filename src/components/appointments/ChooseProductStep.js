import {FieldArray, useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Button from 'components/Button';
import FAIcon from 'components/FAIcon';
import {getBEMClassName} from 'utils';

import Product from './Product';

const ChooseProductStep = () => {
  const {values} = useFormikContext();
  const products = values?.products || [];
  const numProducts = Math.max(products.length, 1);
  return (
    <FieldArray name="products">
      {arrayHelpers => (
        <div className={getBEMClassName('editgrid')}>
          <div className={getBEMClassName('editgrid__groups')}>
            {products.map(({product: productId}, index) => (
              // blank blocks don't have a product selected yet -> so the index is added
              // to make the key guaranteed unique
              <div key={`${productId}-${index}`} className={getBEMClassName('editgrid__group')}>
                <div className={getBEMClassName('editgrid__group-label')}>
                  <FormattedMessage
                    description="Appointments: single product label/header"
                    defaultMessage="Product {number}/{total}"
                    values={{number: index + 1, total: numProducts}}
                  />
                </div>
                <Product namePrefix="products" index={index} />
              </div>
            ))}
          </div>

          <div className={getBEMClassName('editgrid__add-button')}>
            <Button
              type="button"
              variant="primary"
              onClick={() => arrayHelpers.push({product: '', amount: 1})}
            >
              <FAIcon icon="plus" />
              <FormattedMessage
                description="Appointments: add additional product/service button text"
                defaultMessage="Add another product"
              />
            </Button>
          </div>
        </div>
      )}
    </FieldArray>
  );
};

ChooseProductStep.propTypes = {};

export default ChooseProductStep;
