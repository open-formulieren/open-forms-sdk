import {LoadingIndicator} from '@open-formulieren/formio-renderer';
import type {AnyComponentSchema, JSONObject} from '@open-formulieren/types';
import type {FormikErrors} from 'formik';
import {Form, Formik} from 'formik';
import {useContext, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {createSearchParams, useHref, useLocation, useNavigate} from 'react-router';
import {useAsync} from 'react-use';

import {ConfigContext} from '@/Context';
import {CardTitle} from '@/components/Card';
import ErrorMessage from '@/components/Errors/ErrorMessage';
import {Literal} from '@/components/Literal';
import FormStepSummary from '@/components/Summary/FormStepSummary';
import type {GenericSummaryProps} from '@/components/Summary/GenericSummary';
import SummaryConfirmation from '@/components/SummaryConfirmation';
import type {Appointment, Location, Product} from '@/data/appointments';
import {createAppointment} from '@/data/appointments';
import type {ComponentSummary} from '@/data/submissions';
import {ValidationError} from '@/errors';
import useTitle from '@/hooks/useTitle';

import {fieldLabel as dateLabel} from '../fields/DateSelect';
import {getLocations, fieldLabel as locationLabel} from '../fields/LocationSelect';
import {amountLabel} from '../fields/Product';
import {getAllProducts, fieldLabel as productLabel} from '../fields/ProductSelect';
import {fieldLabel as timeLabel} from '../fields/TimeSelect';
import {getContactDetailsFields} from '../steps/ContactDetailsStep';
import type {AppoinmentStep} from '../types';
import {useCreateAppointmentContext} from './CreateAppointmentState';

type FormikValues = Parameters<GenericSummaryProps['onSubmit']>[0];

const getErrorsNavigateTo = (errors: FormikErrors<JSONObject>): AppoinmentStep | null => {
  const errorKeys = Object.keys(errors);

  if (errorKeys.includes('products')) {
    return 'producten';
  }

  const locationAndTimeKeys = ['date', 'datetime', 'location'];
  if (locationAndTimeKeys.some(key => errorKeys.includes(key))) {
    return 'kalender';
  }

  if (errorKeys.includes('contactDetails')) {
    return 'contactgegevens';
  }

  return null;
};

const Summary: React.FC = () => {
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const {state: routerState} = useLocation();
  const navigate = useNavigate();
  const backHref = useHref('../contactgegevens');
  const {appointmentData, submission, setErrors} = useCreateAppointmentContext();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  useTitle(
    intl.formatMessage({
      description: 'Summary page title',
      defaultMessage: 'Check and confirm',
    })
  );

  // throw for unhandled submit errors
  if (submitError) throw submitError;

  // the default values should never kick in, but this makes them type-safe
  const {
    products = [],
    location = '',
    date = '',
    datetime = '',
    contactDetails = {},
  } = appointmentData;

  const productIds = products.map(p => p.productId).sort();

  const {
    loading,
    value = [[], [], []],
    error,
  } = useAsync(async () => {
    const promises: [Promise<Product[]>, Promise<Location[]>, Promise<AnyComponentSchema[]>] = [
      getAllProducts(baseUrl),
      getLocations(baseUrl, productIds),
      getContactDetailsFields(baseUrl, productIds),
    ];
    return await Promise.all(promises);
  }, [baseUrl, JSON.stringify(productIds)]);

  if (error) throw error;
  const [productList, locations, contactDetailComponents] = value;

  // products, as repeating group/editgrid
  const productsData: ComponentSummary[] = [];
  const numProducts = products.length;
  products.forEach(({productId, amount}, index) => {
    if (numProducts > 1) {
      productsData.push({
        name: intl.formatMessage(
          {
            description: 'Appointments: single product label/header',
            defaultMessage: 'Product {number}/{total}',
          },
          {number: index + 1, total: numProducts}
        ),
        value: null,
        component: {
          id: 'products-editgrid',
          type: 'editgrid',
          key: 'products-editgrid',
          label: '',
          disableAddingRemovingRows: false,
          components: [],
          groupLabel: '',
        },
      });
    }

    productsData.push(
      {
        name: intl.formatMessage(productLabel),
        value: productId,
        component: {
          id: 'product',
          type: 'radio',
          key: 'product',
          label: '',
          values: productList.map(({identifier, name}) => ({
            value: identifier,
            label: name,
          })),
          defaultValue: null,
          openForms: {translations: {}, dataSrc: 'manual'},
        },
      },
      {
        name: intl.formatMessage(amountLabel),
        value: amount,
        component: {
          id: 'product-amount',
          type: 'number',
          key: 'product-amount',
          label: '',
          decimalLimit: 0,
        },
      }
    );
  });

  // location and time data, in the shape that FormStepSummary expects
  const locationAndTimeData: ComponentSummary[] = [
    {
      name: intl.formatMessage(locationLabel),
      value: location,
      component: {
        id: 'location',
        type: 'radio',
        key: 'location',
        label: '',
        values: locations.map(({identifier, name}) => ({value: identifier, label: name})),
        defaultValue: null,
        openForms: {translations: {}, dataSrc: 'manual'},
      },
    },
    {
      name: intl.formatMessage(dateLabel),
      value: date,
      component: {
        id: 'date',
        type: 'date',
        key: 'date',
        label: '',
      },
    },
    {
      name: intl.formatMessage(timeLabel),
      value: datetime,
      component: {
        id: 'time',
        type: 'time',
        key: 'time',
        label: '',
      },
    },
  ];

  // contact details data
  const contactDetailsData: ComponentSummary[] = contactDetailComponents.map(component => ({
    name: 'label' in component ? (component.label ?? '') : '',
    value: contactDetails[component.key],
    component,
  }));

  /**
   * Submit the appointment data to the backend.
   */
  const onSubmit = async (statementValues: FormikValues) => {
    setSubmitting(true);
    let appointment: Appointment;
    try {
      appointment = await createAppointment(
        baseUrl,
        submission!,
        products,
        location,
        date,
        datetime,
        contactDetails,
        statementValues
      );
    } catch (e) {
      if (e instanceof ValidationError) {
        const {initialErrors, initialTouched} = e.asFormikProps();
        const navigateTo = getErrorsNavigateTo(initialErrors);
        setErrors({initialErrors, initialTouched});
        if (navigateTo) navigate(`../${navigateTo}`);
        return;
      }
      setSubmitError(e);
      return;
    } finally {
      setSubmitting(false);
    }
    // TODO: store details in sessionStorage instead, to survive hard refreshes
    navigate(
      {
        pathname: '../bevestiging',
        search: createSearchParams({
          statusUrl: appointment.statusUrl,
        }).toString(),
      },
      {
        state: {submission},
      }
    );
  };

  const processingError = submitting ? '' : routerState?.errorMessage;
  return (
    <>
      <CardTitle
        title={
          <FormattedMessage
            description="Check overview and confirm"
            defaultMessage="Check and confirm"
          />
        }
        headingLevel={2}
        headingType="subtitle"
        padded
      />

      {processingError && <ErrorMessage>{processingError}</ErrorMessage>}

      {loading ? (
        <LoadingIndicator position="center" />
      ) : (
        <Formik<FormikValues>
          initialValues={{privacyPolicyAccepted: false, statementOfTruthAccepted: false}}
          onSubmit={onSubmit}
        >
          <Form>
            {/* Products overview */}
            <FormStepSummary
              editUrl="../producten"
              name={
                <FormattedMessage
                  description="Appointment overview: products step title"
                  defaultMessage="{numProducts, plural, one {Product} other {Products}}"
                  values={{numProducts}}
                />
              }
              data={productsData}
              editStepText={<Literal name="changeText" />}
            />

            {/* Selected location and time */}
            <FormStepSummary
              editUrl="../kalender"
              name={
                <FormattedMessage
                  description="Appointment overview: location and time step title"
                  defaultMessage="Location and time"
                />
              }
              data={locationAndTimeData}
              editStepText={<Literal name="changeText" />}
            />

            {/* Contact details */}
            <FormStepSummary
              editUrl="../contactgegevens"
              name={
                <FormattedMessage
                  description="Appointment overview: contact details step title"
                  defaultMessage="Contact details"
                />
              }
              data={contactDetailsData}
              editStepText={<Literal name="changeText" />}
            />

            <SummaryConfirmation
              submissionAllowed="yes"
              prevPage={backHref}
              isAuthenticated={false}
              hideAbortButton
            />
          </Form>
        </Formik>
      )}
    </>
  );
};

export default Summary;
