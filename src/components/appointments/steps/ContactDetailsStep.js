import {Form, Formik} from 'formik';
import PropTypes from 'prop-types';
import React, {useContext, useMemo} from 'react';
import {flushSync} from 'react-dom';
import {FormattedMessage, useIntl} from 'react-intl';
import {Navigate, useNavigate} from 'react-router-dom';
import {useAsync} from 'react-use';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import {ConfigContext} from 'Context';
import {get} from 'api';
import {getCached, setCached} from 'cache';
import {CardTitle} from 'components/Card';
import Loader from 'components/Loader';
import {FormioComponent, getEmptyValue, getSchema} from 'components/formio';
import useTitle from 'hooks/useTitle';

import {useCreateAppointmentContext} from '../CreateAppointment/CreateAppointmentState';
import SubmitRow from '../SubmitRow';

const CACHED_CONTACT_DETAILS_FIELDS_KEY = 'appointments|contactDetailsFields';
const CACHED_CONTACT_DETAILS_FIELDS_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

export const getContactDetailsFields = async (baseUrl, productIds) => {
  const fullKey = `${CACHED_CONTACT_DETAILS_FIELDS_KEY}:${productIds.join(';')}`;
  let components = getCached(fullKey, CACHED_CONTACT_DETAILS_FIELDS_MAX_AGE_MS);
  if (components === null) {
    const multiParams = productIds.map(id => ({product_id: id}));
    components = await get(`${baseUrl}appointments/customer-fields`, {}, multiParams);
    setCached(fullKey, components);
  }
  return components;
};

const ContactDetailsStep = ({navigateTo = null}) => {
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const {
    submitStep,
    appointmentData,
    stepData,
    stepErrors: {initialErrors, initialTouched},
    clearStepErrors,
  } = useCreateAppointmentContext();
  const navigate = useNavigate();
  useTitle(
    intl.formatMessage({
      description: 'Appointments: contact details step page title',
      defaultMessage: 'Contact details',
    })
  );

  const products = appointmentData?.products || [];
  const productIds = products.map(p => p.productId).sort();

  const {
    loading,
    value: components,
    error,
  } = useAsync(async () => {
    if (!productIds.length) return [];
    return await getContactDetailsFields(baseUrl, productIds);
  }, [baseUrl, JSON.stringify(productIds)]);
  if (error) throw error;

  const emptyValues =
    !loading &&
    Object.fromEntries(components.map(component => [component.key, getEmptyValue(component)]));

  const validationSchema = useMemo(() => {
    if (loading) return null;
    const fieldSchemas = Object.fromEntries(
      components.map(component => [component.key, getSchema(component)])
    );
    return z.object(fieldSchemas);
  }, [loading, components]);

  // if we don't have products or appointment details in the state, redirect back to the start
  if (!products.length || !appointmentData.location || !appointmentData.datetime) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <CardTitle
        title={
          <FormattedMessage
            description="Appointments: contact details step title"
            defaultMessage="Contact details"
          />
        }
        component="h2"
        headingType="subtitle"
        modifiers={['padded']}
      />

      {loading && <Loader modifiers={['centered']} />}
      {!loading && (
        <Formik
          initialValues={{...emptyValues, ...stepData}}
          initialErrors={initialErrors?.contactDetails}
          initialTouched={initialTouched?.contactDetails}
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={
            validationSchema ? toFormikValidationSchema(validationSchema) : undefined
          }
          onSubmit={(values, {setSubmitting}) => {
            flushSync(() => {
              clearStepErrors();
              submitStep(values);
              setSubmitting(false);
            });
            if (navigateTo !== null) navigate(navigateTo);
          }}
        >
          {({isValid, dirty}) => (
            // TODO: don't do inline style
            <Form style={{width: '100%'}}>
              <div className="openforms-form-field-container">
                {components.map(component => (
                  <FormioComponent key={component.key} component={component} />
                ))}
              </div>

              <SubmitRow
                canSubmit={Boolean(!loading && validationSchema)}
                nextText={intl.formatMessage({
                  description: 'Appointments contact details step: next step text',
                  defaultMessage: 'To overview',
                })}
                previousText={intl.formatMessage({
                  description: 'Appointments contact details step: previous step text',
                  defaultMessage: 'Back to location and time',
                })}
                navigateBackTo="kalender"
              />
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

ContactDetailsStep.propTypes = {
  navigateTo: PropTypes.string,
};

export default ContactDetailsStep;
