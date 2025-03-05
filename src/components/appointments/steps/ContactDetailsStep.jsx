import {FormioForm} from '@open-formulieren/formio-renderer';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {flushSync} from 'react-dom';
import {FormattedMessage, useIntl} from 'react-intl';
import {Navigate, useNavigate} from 'react-router';
import {useAsync} from 'react-use';

import {ConfigContext} from 'Context';
import {get} from 'api';
import {getCached, setCached} from 'cache';
import {CardTitle} from 'components/Card';
import Loader from 'components/Loader';
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
  const {baseUrl, requiredFieldsWithAsterisk} = useContext(ConfigContext);
  const {
    submitStep,
    appointmentData,
    stepData,
    stepErrors: {initialErrors},
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
        <FormioForm
          components={components}
          values={stepData}
          errors={initialErrors?.contactDetails}
          onSubmit={async values => {
            flushSync(() => {
              clearStepErrors();
              submitStep(values);
            });
            if (navigateTo !== null) navigate(navigateTo);
          }}
          requiredFieldsWithAsterisk={requiredFieldsWithAsterisk}
        >
          {/* TODO: ensure we can pass an ID for the submit button so that we don't
          need to rely on children anymore to submit the form */}
          <SubmitRow
            canSubmit={!loading}
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
        </FormioForm>
      )}
    </>
  );
};

ContactDetailsStep.propTypes = {
  navigateTo: PropTypes.string,
};

export default ContactDetailsStep;
