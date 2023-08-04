import {Heading3, UnorderedList, UnorderedListItem} from '@utrecht/component-library-react';
import {Form, Formik} from 'formik';
import PropTypes from 'prop-types';
import React, {useContext, useEffect} from 'react';
import {flushSync} from 'react-dom';
import {FormattedMessage, useIntl} from 'react-intl';
import {useNavigate} from 'react-router-dom';
import {useAsync} from 'react-use';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import {ConfigContext} from 'Context';
import {CardTitle} from 'components/Card';
import Loader from 'components/Loader';
import useTitle from 'hooks/useTitle';

import {useCreateAppointmentContext} from './CreateAppointment/CreateAppointmentState';
import DateSelect from './DateSelect';
import LocationSelect from './LocationSelect';
import {getProducts} from './ProductSelect';
import SubmitRow from './SubmitRow';
import TimeSelect from './TimeSelect';
import {ProductsType} from './types';

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

const LocationAndTimeStepFields = ({isValid, dirty, validateForm, setErrors}) => {
  const intl = useIntl();
  const {
    appointmentData: {products = []},
    stepErrors: {initialErrors},
  } = useCreateAppointmentContext();
  // workaround to validate the form on mount without discarding the initialErrors.
  // Due to the auto location select, the form is marked dirty but validation hasn't run
  // as validateOnMount is not set. Setting validateOnMount causes initialErrors to be
  // discarded otherwise.
  useEffect(() => {
    validateForm().then(() => {
      if (!Object.keys(initialErrors).length) return;
      setErrors(initialErrors);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // TODO: don't do inline style
    <Form style={{width: '100%'}}>
      <div>
        <LocationSelect products={products} />
        <DateSelect products={products} />
        <TimeSelect products={products} />
      </div>

      <SubmitRow
        canSubmit={dirty && isValid}
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
    stepErrors: {initialTouched},
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
        initialTouched={initialTouched}
        validateOnChange={false}
        validateOnBlur
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
  } = useAsync(async () => await getProducts(baseUrl), [baseUrl]);

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