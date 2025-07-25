import {EditGrid} from '@open-formulieren/formio-renderer';
import {Form, Formik} from 'formik';
import {produce} from 'immer';
import {useContext} from 'react';
import {flushSync} from 'react-dom';
import {FormattedMessage, useIntl} from 'react-intl';
import {useNavigate, useSearchParams} from 'react-router';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import {CardTitle} from 'components/Card';
import useTitle from 'hooks/useTitle';

import {AppointmentConfigContext} from '../Context';
import {useCreateAppointmentContext} from '../CreateAppointment/CreateAppointmentState';
import SubmitRow from '../SubmitRow';
import {Product} from '../fields';

export interface AppointmentProduct {
  productId: string;
  amount: number;
}

export interface ProductStepValues {
  products: AppointmentProduct[];
}

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

export interface ChooseProductStepFieldsProps {
  values: ProductStepValues;
}

const ChooseProductStepFields: React.FC<ChooseProductStepFieldsProps> = ({
  values: {products = []},
}) => {
  const intl = useIntl();
  const {supportsMultipleProducts} = useContext(AppointmentConfigContext);
  const selectedProductIds = products.map(p => p.productId).filter(Boolean);
  const numProducts = Math.max(products.length, 1);
  return (
    <Form>
      {supportsMultipleProducts ? (
        <EditGrid
          label=""
          name="products"
          emptyItem={{productId: '', amount: 1}}
          addButtonLabel={intl.formatMessage({
            description: 'Appointments: add additional product/service button text',
            defaultMessage: 'Add another product',
          })}
          getItemHeading={(_, index) => (
            <FormattedMessage
              description="Appointments: single product label/header"
              defaultMessage="Product {number}/{total}"
              values={{number: index + 1, total: numProducts}}
            />
          )}
          getItemBody={(_, index) => (
            <Product namePrefix="products" index={index} selectedProductIds={selectedProductIds} />
          )}
          canRemoveItem={() => numProducts > 1}
        />
      ) : (
        <Product namePrefix="products" index={0} selectedProductIds={selectedProductIds} />
      )}

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

const INITIAL_VALUES: ProductStepValues = {
  products: [
    {
      productId: '',
      amount: 1,
    },
  ],
};

export interface ChooseProductStepProps {
  navigateTo?: string | null;
}

const ChooseProductStep: React.FC<ChooseProductStepProps> = ({navigateTo = null}) => {
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
      <Formik<ProductStepValues>
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

export default ChooseProductStep;
