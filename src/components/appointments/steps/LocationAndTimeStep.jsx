import {Heading3, UnorderedList, UnorderedListItem} from '@utrecht/component-library-react';
import {Form, Formik, useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {flushSync} from 'react-dom';
import {FormattedMessage, useIntl} from 'react-intl';
import {Navigate, useNavigate} from 'react-router-dom';
import {useAsync} from 'react-use';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import {ConfigContext} from 'Context';
import {CardTitle} from 'components/Card';
import Loader from 'components/Loader';
import useTitle from 'hooks/useTitle';

import {useCreateAppointmentContext} from '../CreateAppointment/CreateAppointmentState';
import SubmitRow from '../SubmitRow';
import {DateSelect, LocationSelect, TimeSelect} from '../fields';
import {getAllProducts} from '../fields/ProductSelect';
import {ProductsType} from '../types';

const schema = z.object({
  location: z.string(),
  date: z.coerce.date(),
  datetime: z.string().datetime({offset: true}),
});

// XXX: check field dependencies - clear time if date/location is not valid etc.

const INITIAL_VALUES = {
  location: '',
  date: '',
  datetime: '',
};

const LocationAndTimeStepFields = () => {
  const intl = useIntl();
  const {values, setFieldValue} = useFormikContext();
  const {
    appointmentData: {products = []},
  } = useCreateAppointmentContext();

  const onFieldChange = event => {
    const {name, value: newValue} = event.target;
    const currentValue = values[name];

    if (newValue === currentValue) return;

    switch (name) {
      case 'location': {
        setFieldValue('date', '');
        setFieldValue('datetime', '');
        break;
      }
      case 'date': {
        setFieldValue('datetime', '');
        break;
      }
      default:
        throw new Error(`Unknown field: '${name}'`);
    }
  };

  // if we don't have products in the state, redirect back to the start
  if (!products.length) {
    return <Navigate to="/" replace />;
  }

  return (
    // TODO: don't do inline style
    <Form style={{width: '100%'}}>
      <div className="openforms-form-field-container">
        <LocationSelect products={products} onChange={onFieldChange} />
        <DateSelect products={products} onChange={onFieldChange} />
        <TimeSelect products={products} />
      </div>

      <SubmitRow
        canSubmit
        nextText={intl.formatMessage({
          description: 'Appointments location and time step: next step text',
          defaultMessage: 'To contact details',
        })}
        previousText={intl.formatMessage({
          description: 'Appointments location and time step: previous step text',
          defaultMessage: 'Back to products',
        })}
        navigateBackTo="producten"
      />
    </Form>
  );
};

const LocationAndTimeStep = ({navigateTo = null}) => {
  const intl = useIntl();
  const {
    appointmentData: {products = []},
    stepData,
    stepErrors: {initialErrors, initialTouched},
    clearStepErrors,
    submitStep,
  } = useCreateAppointmentContext();
  const navigate = useNavigate();
  useTitle(
    intl.formatMessage({
      description: 'Appointments: location and time step step page title',
      defaultMessage: 'Location and time',
    })
  );

  return (
    <>
      <CardTitle
        title={
          <FormattedMessage
            description="Appointments: select location and time step title"
            defaultMessage="Location and time"
          />
        }
        component="h2"
        headingType="subtitle"
        modifiers={['padded']}
      />

      <ProductSummary products={products} />

      <Formik
        initialValues={{...INITIAL_VALUES, ...stepData}}
        initialErrors={initialErrors}
        initialTouched={initialTouched}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={toFormikValidationSchema(schema)}
        onSubmit={(values, {setSubmitting}) => {
          flushSync(() => {
            clearStepErrors();
            submitStep(values);
            setSubmitting(false);
          });
          if (navigateTo !== null) navigate(navigateTo);
        }}
        component={LocationAndTimeStepFields}
      />
    </>
  );
};

LocationAndTimeStep.propTypes = {
  navigateTo: PropTypes.string,
};

const ProductSummary = ({products}) => {
  const {baseUrl} = useContext(ConfigContext);
  const {
    loading,
    value: allProducts,
    error,
  } = useAsync(async () => await getAllProducts(baseUrl), [baseUrl]);

  if (!products.length) return null;
  if (error) throw error;
  if (loading) {
    return <Loader modifiers={['small']} />;
  }

  const productsById = Object.fromEntries(allProducts.map(p => [p.identifier, p.name]));
  return (
    <>
      <Heading3 className="utrecht-heading-3--distanced">
        <FormattedMessage
          description="Product summary on appointments location and time step heading"
          defaultMessage="Your products"
        />
      </Heading3>
      <UnorderedList className="utrecht-unordered-list--distanced">
        {products.map(({productId, amount}, index) => (
          <UnorderedListItem key={`${productId}-${index}`}>
            <FormattedMessage
              description="Product summary on appointments location and time step"
              defaultMessage="{name}: {amount}x"
              values={{
                amount,
                name: productsById[productId],
              }}
            />
          </UnorderedListItem>
        ))}
      </UnorderedList>
    </>
  );
};

ProductSummary.propTypes = {
  products: ProductsType.isRequired,
};

export default LocationAndTimeStep;
