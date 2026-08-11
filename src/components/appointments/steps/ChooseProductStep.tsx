import {EditGrid} from '@open-formulieren/formio-renderer';
import {Heading3} from '@utrecht/component-library-react';
import {Form, Formik, useFormikContext} from 'formik';
import {produce} from 'immer';
import {useContext, useEffect, useMemo} from 'react';
import {flushSync} from 'react-dom';
import {FormattedMessage, type IntlShape, useIntl} from 'react-intl';
import {useNavigate, useSearchParams} from 'react-router';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import {ConfigContext} from '@/Context';
import {CardTitle} from '@/components/Card';
import type {AppointmentProduct} from '@/data/appointments';
import useTitle from '@/hooks/useTitle';

import {AppointmentConfigContext} from '../Context';
import {useCreateAppointmentContext} from '../CreateAppointment/CreateAppointmentState';
import SubmitRow from '../SubmitRow';
import {Product} from '../fields';
import {getAllProducts} from '../fields/ProductSelect';

export interface ProductStepValues {
  products: AppointmentProduct[];
}

export const getValidationSchema = (intl: IntlShape, supportsMultipleProducts: boolean) => {
  const productSchema = z
    .array(
      z
        .object({
          productId: z.string(),
          amount: z.number().int().gte(1).finite(),
          amountLimit: z.number().int(),
        })
        .superRefine((data, ctx) => {
          if (data.amountLimit > 0 && data.amountLimit < data.amount) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: intl.formatMessage(
                {
                  description: 'Amount limit exceeded error message',
                  defaultMessage: 'The maximum amount of persons for this product is {maxAmount}.',
                },
                {
                  maxAmount: data.amountLimit,
                }
              ),
              path: ['amount'],
            });
          }
        })
    )
    .nonempty();

  const chooseSingleProductSchema = z.object({
    products: productSchema.max(1),
  });

  const chooseMultiProductSchema = z.object({
    products: productSchema,
  });

  return supportsMultipleProducts ? chooseMultiProductSchema : chooseSingleProductSchema;
};

export interface ChooseProductStepFieldsProps {
  values: ProductStepValues;
}

const ChooseProductStepFields: React.FC<ChooseProductStepFieldsProps> = ({
  values: {products = []},
}) => {
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const {setFieldValue} = useFormikContext();
  const {supportsMultipleProducts} = useContext(AppointmentConfigContext);
  const selectedProductIds = products.map(p => p.productId).filter(Boolean);
  const numProducts = Math.max(products.length, 1);

  useEffect(() => {
    const fetchAllProducts = async () => {
      const allProducts = await getAllProducts(baseUrl);

      products?.forEach((product, index) => {
        const matchingProduct = allProducts.find(p => p.identifier === product.productId);

        // set the correct limit of persons based on the retrieved products
        if (matchingProduct) {
          setFieldValue(`products.${index}.amountLimit`, matchingProduct.amountLimit);
        }
      });
    };

    fetchAllProducts();
  }, [products, baseUrl, setFieldValue]);

  return (
    <Form>
      {supportsMultipleProducts ? (
        <EditGrid
          label=""
          name="products"
          emptyItem={{productId: '', amount: 1, amountLimit: 0}}
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
      amountLimit: 0,
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
  } = useCreateAppointmentContext<'producten'>();
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

  const validationSchema = useMemo(
    () => toFormikValidationSchema(getValidationSchema(intl, supportsMultipleProducts)),
    [intl, supportsMultipleProducts]
  );

  return (
    <>
      <CardTitle
        title={
          <FormattedMessage
            description="Appointments products step title"
            defaultMessage="Select your product(s)"
          />
        }
        padded
      />
      <Heading3>
        <FormattedMessage
          description="Appointment reason question"
          defaultMessage="What do you want to make an appointment for?"
        />
      </Heading3>
      <Formik<ProductStepValues>
        initialValues={{...initialValues, ...stepData}}
        initialErrors={initialErrors}
        initialTouched={initialTouched}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={validationSchema}
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
