import {FieldArray, Form, Formik} from 'formik';
import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {flushSync} from 'react-dom';
import {FormattedMessage, useIntl} from 'react-intl';
import {useNavigate} from 'react-router-dom';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import Button from 'components/Button';
import {CardTitle} from 'components/Card';
import FAIcon from 'components/FAIcon';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import useTitle from 'hooks/useTitle';
import {getBEMClassName} from 'utils';

import {AppointmentConfigContext} from './Context';
import {useCreateAppointmentContext} from './CreateAppointment/CreateAppointmentState';
import Product from './Product';
import SubmitRow from './SubmitRow';

const productSchema = z
  .array(
    z.object({
      productId: z.string(),
      amount: z.number().int().gte(1).finite(),
    })
  )
  .nonempty();

const chooseSingleProductSchema = z.object({products: productSchema.max(1)});
const chooseMultiProductSchema = z.object({products: productSchema});

const ChooseProductStepFields = ({values: {products = []}, validateForm}) => {
  const intl = useIntl();
  const {supportsMultipleProducts} = useContext(AppointmentConfigContext);
  const selectedProductIds = products.map(p => p.productId).filter(Boolean);

  /**
   * Decorate an arrayHelper callback to invoke the validate function.
   *
   * Formik supports the `validateOnChange` prop op `FieldArray`, _but that only
   * works if `validateOnChange` is enabled on the parent `Formik`_, which is not the
   * case here.
   *
   * So, we wrap the helper and invoke the validate function ourselves, and we have to
   * do this in a particular way so that the validate runs against the new state rather
   * than the encapsulated state in the callback or stale state due to React 18's
   * batching - we do this by flushing the array helper synchronously.
   */
  const withValidate = callback => () => {
    flushSync(callback);
    validateForm();
  };

  const numProducts = Math.max(products.length, 1);
  return (
    // TODO: don't do inline style
    <Form style={{width: '100%'}}>
      <FieldArray name="products">
        {arrayHelpers => (
          <div className={getBEMClassName('editgrid')}>
            <div className={getBEMClassName('editgrid__groups')}>
              {products.map(({productId}, index) => (
                // blank blocks don't have a product selected yet -> so the index is added
                // to make the key guaranteed unique
                <ProductWrapper
                  key={`${productId}-${index}`}
                  index={index}
                  numProducts={numProducts}
                  onRemove={withValidate(() => arrayHelpers.remove(index))}
                >
                  <Product
                    namePrefix="products"
                    index={index}
                    selectedProductIds={selectedProductIds}
                  />
                </ProductWrapper>
              ))}
            </div>

            {supportsMultipleProducts && (
              <div className={getBEMClassName('editgrid__add-button')}>
                <Button
                  type="button"
                  variant="primary"
                  onClick={withValidate(() => arrayHelpers.push({productId: '', amount: 1}))}
                >
                  <FAIcon icon="plus" />
                  <FormattedMessage
                    description="Appointments: add additional product/service button text"
                    defaultMessage="Add another product"
                  />
                </Button>
              </div>
            )}
          </div>
        )}
      </FieldArray>

      <SubmitRow
        canSubmit
        nextText={intl.formatMessage({
          description: 'Appointments products step: next step text',
          defaultMessage: 'Confirm products',
        })}
      />
    </Form>
  );
};

ChooseProductStepFields.propTypes = {
  values: PropTypes.object.isRequired,
  validateForm: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
};

const ProductWrapper = ({index, numProducts, onRemove, children}) => {
  const {supportsMultipleProducts} = useContext(AppointmentConfigContext);
  if (!supportsMultipleProducts) {
    return <>{children}</>;
  }
  return (
    <div className={getBEMClassName('editgrid__group')}>
      <div className={getBEMClassName('editgrid__group-label')}>
        <FormattedMessage
          description="Appointments: single product label/header"
          defaultMessage="Product {number}/{total}"
          values={{number: index + 1, total: numProducts}}
        />
      </div>

      {children}

      {numProducts > 1 && (
        <Toolbar modifiers={['reverse']}>
          <ToolbarList>
            <Button type="button" variant="danger" onClick={onRemove}>
              <FormattedMessage
                description="Appointments: remove product/service button text"
                defaultMessage="Remove"
              />
            </Button>
          </ToolbarList>
        </Toolbar>
      )}
    </div>
  );
};

const INITIAL_VALUES = {
  products: [
    {
      productId: '',
      amount: 1,
    },
  ],
};

const ChooseProductStep = ({navigateTo = null}) => {
  const intl = useIntl();
  const {supportsMultipleProducts} = useContext(AppointmentConfigContext);
  const {
    stepData,
    stepErrors: {initialErrors, initialTouched},
    clearStepErrors,
    submitStep,
  } = useCreateAppointmentContext();
  const navigate = useNavigate();
  useTitle(
    intl.formatMessage({
      description: 'Appointments products step page title',
      defaultMessage: 'Product',
    })
  );

  const validationSchema = supportsMultipleProducts
    ? chooseMultiProductSchema
    : chooseSingleProductSchema;

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
      <Formik
        initialValues={{...INITIAL_VALUES, ...stepData}}
        initialErrors={initialErrors}
        initialTouched={initialTouched}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={toFormikValidationSchema(validationSchema)}
        onSubmit={(values, {setSubmitting}) => {
          flushSync(() => {
            clearStepErrors();
            submitStep(values);
            setSubmitting(false);
          });
          if (navigateTo !== null) navigate(navigateTo);
        }}
        component={ChooseProductStepFields}
      />
    </>
  );
};

ChooseProductStep.propTypes = {
  navigateTo: PropTypes.string,
};

export default ChooseProductStep;
