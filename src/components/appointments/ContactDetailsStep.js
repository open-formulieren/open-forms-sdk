import {useFormikContext} from 'formik';
import {default as lodashGet} from 'lodash/get';
import React, {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useAsync} from 'react-use';

import {ConfigContext} from 'Context';
import {get} from 'api';
import {CardTitle} from 'components/Card';
import Loader from 'components/Loader';
import {FormioComponent} from 'components/formio';
import useTitle from 'hooks/useTitle';

import {isStepValid as isProductStepValid} from './ChooseProductStep';
import {isStepValid as isLocationStepValid} from './LocationAndTimeStep';
import SubmitRow from './SubmitRow';

// TODO: replace with ZOD validation, see #435
export const isStepValid = (data, components = []) => {
  if (!components.length) return false;
  const hasMissingInput = components.some(component => {
    const value = lodashGet(data, component.key);
    return !value;
  });
  return isProductStepValid(data) && isLocationStepValid(data) && !hasMissingInput;
};

const ContactDetailsStep = () => {
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const {values} = useFormikContext();
  useTitle(
    intl.formatMessage({
      description: 'Appointments: contact details step page title',
      defaultMessage: 'Contact details',
    })
  );

  const productIds = values.products.map(p => p.productId);
  const {
    loading,
    value: components,
    error,
  } = useAsync(async () => {
    const multiParams = productIds.map(id => ({product_id: id}));
    return await get(`${baseUrl}appointments/customer-fields`, {}, multiParams);
  }, [baseUrl, JSON.stringify(productIds)]);
  if (error) throw error;

  // TODO: hook up component.validate properties into zod schema, #435

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
        <>
          {components.map(component => (
            <FormioComponent key={component.key} component={component} />
          ))}
        </>
      )}

      <SubmitRow
        canSubmit={isStepValid(values, components)}
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
    </>
  );
};

ContactDetailsStep.propTypes = {};

export default ContactDetailsStep;
