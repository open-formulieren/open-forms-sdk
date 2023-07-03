import {FieldArray, useFormikContext} from 'formik';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import Button from 'components/Button';
import {CardTitle} from 'components/Card';
import FAIcon from 'components/FAIcon';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import useTitle from 'hooks/useTitle';
import {getBEMClassName} from 'utils';

import Product from './Product';
import SubmitRow from './SubmitRow';

const isValidProduct = ({productId, amount}) => {
  if (!productId) return false;
  if (amount <= 0) return false;
  return true;
};

// TODO: replace with ZOD validation, see #435
export const isStepValid = data => {
  const products = data?.products;
  if (!products || products.length <= 0) {
    return false;
  }
  const allProductsComplete = products.every(isValidProduct);
  return allProductsComplete;
};

const ChooseProductStep = () => {
  const intl = useIntl();
  const {values} = useFormikContext();
  useTitle(
    intl.formatMessage({
      description: 'Appointments products step page title',
      defaultMessage: 'Product',
    })
  );

  const products = values?.products || [];
  const numProducts = Math.max(products.length, 1);
  return (
    <>
      <CardTitle
        title={
          <FormattedMessage
            description="Appointments products step title"
            defaultMessage="Select your product(s)"
          />
        }
        component="h2"
        headingType="subtitle"
        modifiers={['padded']}
      />

      <FieldArray name="products">
        {arrayHelpers => (
          <div className={getBEMClassName('editgrid')}>
            <div className={getBEMClassName('editgrid__groups')}>
              {products.map(({productId}, index) => (
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

                  {numProducts > 1 && (
                    <Toolbar modifiers={['reverse']}>
                      <ToolbarList>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          <FormattedMessage
                            description="Appointments: remove product/service button text"
                            defaultMessage="Remove"
                          />
                        </Button>
                      </ToolbarList>
                    </Toolbar>
                  )}
                </div>
              ))}
            </div>

            <div className={getBEMClassName('editgrid__add-button')}>
              <Button
                type="button"
                variant="primary"
                onClick={() => arrayHelpers.push({productId: '', amount: 1})}
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

      <SubmitRow
        canSubmit={isStepValid(values)}
        nextText={intl.formatMessage({
          description: 'Appointments products step: next step text',
          defaultMessage: 'Confirm products',
        })}
      />
    </>
  );
};

ChooseProductStep.propTypes = {};

export default ChooseProductStep;
