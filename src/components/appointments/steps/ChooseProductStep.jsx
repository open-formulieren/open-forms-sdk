import {FieldArray, Form, Formik} from 'formik';
import {produce} from 'immer';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {flushSync} from 'react-dom';
import {FormattedMessage, useIntl} from 'react-intl';
import {useNavigate, useSearchParams} from 'react-router';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import {OFButton} from 'components/Button';
import {CardTitle} from 'components/Card';
import {EditGrid, EditGridButtonGroup, EditGridItem} from 'components/EditGrid';
import FAIcon from 'components/FAIcon';
import useTitle from 'hooks/useTitle';

import {AppointmentConfigContext} from '../Context';
import {useCreateAppointmentContext} from '../CreateAppointment/CreateAppointmentState';
import SubmitRow from '../SubmitRow';
import {Product} from '../fields';

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
          <EditGrid
            addButtonLabel={
              <>
                <FAIcon icon="plus" />{' '}
                <FormattedMessage
                  description="Appointments: add additional product/service button text"
                  defaultMessage="Add another product"
                />
              </>
            }
            onAddItem={
              supportsMultipleProducts
                ? withValidate(() => arrayHelpers.push({productId: '', amount: 1}))
                : undefined
            }
          >
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
          </EditGrid>
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

  const buttonRow = numProducts > 1 && (
    <EditGridButtonGroup>
      <OFButton appearance="primary-action-button" hint="danger" onClick={onRemove}>
        <FormattedMessage
          description="Appointments: remove product/service button text"
          defaultMessage="Remove"
        />
      </OFButton>
    </EditGridButtonGroup>
  );

  return (
    <EditGridItem
      heading={
        <FormattedMessage
          description="Appointments: single product label/header"
          defaultMessage="Product {number}/{total}"
          values={{number: index + 1, total: numProducts}}
        />
      }
      buttons={buttonRow}
    >
      {children}
    </EditGridItem>
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
  const [params] = useSearchParams();
  const initialProductId = params.get('product');

  const initialValues = produce(INITIAL_VALUES, draft => {
    if (initialProductId) {
      draft.products[0].productId = initialProductId;
    }
  });

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
        headingType="subtitle"
        padded
      />
      <Formik
        initialValues={{...initialValues, ...stepData}}
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
