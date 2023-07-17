import React, {useContext, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useNavigate} from 'react-router-dom';
import {useAsync} from 'react-use';

import {ConfigContext} from 'Context';
import {CardTitle} from 'components/Card';
import FormStepSummary from 'components/FormStepSummary';
import Loader from 'components/Loader';
import {getPrivacyPolicyInfo} from 'components/Summary/utils';
import SummaryConfirmation from 'components/SummaryConfirmation';
import useTitle from 'hooks/useTitle';

import {getContactDetailsFields} from '../ContactDetailsStep';
import {fieldLabel as dateLabel} from '../DateSelect';
import {getLocations, fieldLabel as locationLabel} from '../LocationSelect';
import {amountLabel} from '../Product';
import {getProducts, fieldLabel as productLabel} from '../ProductSelect';
import {fieldLabel as timeLabel} from '../TimeSelect';
import {useCreateAppointmentContext} from './CreateAppointmentState';

const INITIAL_PRIVACY_INFO = {
  requiresPrivacyConsent: true,
  privacyLabel: '...',
};

const Summary = () => {
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const navigate = useNavigate();
  const {appointmentData, submission} = useCreateAppointmentContext();
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  useTitle(
    intl.formatMessage({
      description: 'Summary page title',
      defaultMessage: 'Check and confirm',
    })
  );

  const {products, location, date, datetime, ...contactDetails} = appointmentData;
  const productIds = products.map(p => p.productId).sort();

  const {
    loading,
    value = [],
    error,
  } = useAsync(async () => {
    const promises = [
      getPrivacyPolicyInfo(new URL(baseUrl).origin),
      getProducts(baseUrl),
      getLocations(baseUrl, productIds),
      getContactDetailsFields(baseUrl, productIds),
    ];
    return await Promise.all(promises);
  }, [baseUrl, JSON.stringify(productIds)]);

  if (error) throw error;

  const [
    privacyInfo = INITIAL_PRIVACY_INFO,
    productList = [],
    locations = [],
    contactDetailComponents = [],
  ] = value;

  // products, as repeating group/editgrid
  let productsData = [];
  const numProducts = products.length;
  products.forEach(({productId, amount}, index) => {
    const header = (
      <FormattedMessage
        description="Appointments: single product label/header"
        defaultMessage="Product {number}/{total}"
        values={{number: index + 1, total: numProducts}}
      />
    );
    if (numProducts > 1) {
      productsData.push({name: header, value: null, component: {type: 'editgrid'}});
    }

    productsData.push(
      {
        name: intl.formatMessage(productLabel),
        value: productId,
        component: {
          type: 'radio',
          values: productList.map(({identifier, name}) => ({
            value: identifier,
            label: name,
          })),
        },
      },
      {
        name: intl.formatMessage(amountLabel),
        value: amount,
        component: {type: 'number', decimalLimit: 0},
      }
    );
  });

  // location and time data, in the shape that FormStepSummary expects
  const locationAndTimeData = [
    {
      name: intl.formatMessage(locationLabel),
      value: location,
      component: {
        type: 'radio',
        values: locations.map(({identifier, name}) => ({value: identifier, label: name})),
      },
    },
    {
      name: intl.formatMessage(dateLabel),
      value: date,
      component: {type: 'date'},
    },
    {
      name: intl.formatMessage(timeLabel),
      value: datetime,
      component: {type: 'time'},
    },
  ];

  // contact details data
  const contactDetailsData = contactDetailComponents.map(component => ({
    name: component.label,
    value: contactDetails[component.key],
    component,
  }));

  const onSubmit = event => {
    event.preventDefault();
    console.group('Submitting...');
    console.log('Submission', submission);
    console.log('Data', appointmentData);
    console.groupEnd();
  };

  return (
    <>
      <CardTitle
        title={
          <FormattedMessage
            description="Check overview and confirm"
            defaultMessage="Check and confirm"
          />
        }
        component="h2"
        headingType="subtitle"
        modifiers={['padded']}
      />

      {loading ? (
        <Loader modifiers={['centered']} />
      ) : (
        <form onSubmit={onSubmit}>
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
            editStepText={
              <FormattedMessage
                description="Appointment overview: 'edit products' link text"
                defaultMessage="Change {numProducts, plural, one {product} other {products}}"
                values={{numProducts}}
              />
            }
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
            editStepText={
              <FormattedMessage
                description="Appointment overview: 'edit location or time' link text"
                defaultMessage="Change location or time"
              />
            }
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
            editStepText={
              <FormattedMessage
                description="Appointment overview: 'edit contact details' link text"
                defaultMessage="Change contact details"
              />
            }
          />

          <SummaryConfirmation
            submissionAllowed="yes"
            privacy={{...privacyInfo, policyAccepted: privacyPolicyAccepted}}
            onPrivacyCheckboxChange={() => setPrivacyPolicyAccepted(!privacyPolicyAccepted)}
            onPrevPage={() => navigate('../contactgegevens')}
          />
        </form>
      )}
    </>
  );
};

Summary.propTypes = {};

export default Summary;
