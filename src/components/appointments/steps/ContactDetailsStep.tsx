import {FormioForm} from '@open-formulieren/formio-renderer';
import type {AnyComponentSchema} from '@open-formulieren/types';
import {useContext} from 'react';
import {flushSync} from 'react-dom';
import {FormattedMessage, useIntl} from 'react-intl';
import {Navigate, useNavigate} from 'react-router';
import {useAsync} from 'react-use';

import {ConfigContext} from '@/Context';
import {get} from '@/api';
import {getCached, setCached} from '@/cache';
import {CardTitle} from '@/components/Card';
import Loader from '@/components/Loader';
import useTitle from '@/hooks/useTitle';

import {useCreateAppointmentContext} from '../CreateAppointment/CreateAppointmentState';
import SubmitRow from '../SubmitRow';
import {LocationAndDateTimeSummary} from '../summary/LocationAndDatetimeSummary';
import {ProductSummary} from '../summary/ProductSummary';

const CACHED_CONTACT_DETAILS_FIELDS_KEY = 'appointments|contactDetailsFields';
const CACHED_CONTACT_DETAILS_FIELDS_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

export const getContactDetailsFields = async (
  baseUrl: string,
  productIds: string[]
): Promise<AnyComponentSchema[]> => {
  const fullKey = `${CACHED_CONTACT_DETAILS_FIELDS_KEY}:${productIds.join(';')}`;
  let components: AnyComponentSchema[] | null = getCached<AnyComponentSchema[]>(
    fullKey,
    CACHED_CONTACT_DETAILS_FIELDS_MAX_AGE_MS
  );
  if (components === null) {
    const multiParams = productIds.map(id => ({product_id: id}));
    components = (await get<AnyComponentSchema[]>(
      `${baseUrl}appointments/customer-fields`,
      {},
      multiParams
    ))!;
    setCached<AnyComponentSchema[]>(fullKey, components);
  }
  return components;
};

export interface ContactDetailsStepProps {
  navigateTo?: string;
}

const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({navigateTo = ''}) => {
  const intl = useIntl();
  const {baseUrl, requiredFieldsWithAsterisk} = useContext(ConfigContext);
  const {
    submitStep,
    appointmentData,
    stepData,
    stepErrors: {initialErrors},
    clearStepErrors,
  } = useCreateAppointmentContext<'contactgegevens'>();
  const navigate = useNavigate();
  useTitle(
    intl.formatMessage({
      description: 'Appointments: contact details step page title',
      defaultMessage: 'Contact details',
    })
  );

  const products = appointmentData?.products || [];
  const productIds = products.map(p => p.productId).sort();

  const locationIdentifier = appointmentData?.location || '';
  const appointmentDatetime = appointmentData?.datetime || '';

  const {
    loading,
    value: components = [],
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
        headingType="subtitle"
        padded
      />

      {loading && <Loader modifiers={['centered']} />}
      {!loading && (
        <>
          {/* previous steps summary */}
          <ProductSummary products={products} />
          <LocationAndDateTimeSummary
            products={products}
            selectedLocationIdentifier={locationIdentifier}
            selectedLocationDatetime={appointmentDatetime}
          />

          <FormioForm
            components={components}
            values={stepData?.contactDetails}
            // @ts-expect-error the Errors type in our renderer needs to support undefined
            errors={initialErrors?.contactDetails}
            onSubmit={async values => {
              flushSync(() => {
                clearStepErrors();
                submitStep({contactDetails: values});
              });
              if (navigateTo) navigate(navigateTo);
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
        </>
      )}
    </>
  );
};

export default ContactDetailsStep;
