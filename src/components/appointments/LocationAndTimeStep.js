import {Heading3, UnorderedList, UnorderedListItem} from '@utrecht/component-library-react';
import {useFormikContext} from 'formik';
import React, {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useAsync} from 'react-use';

import {ConfigContext} from 'Context';
import {CardTitle} from 'components/Card';
import Loader from 'components/Loader';
import useTitle from 'hooks/useTitle';

import {isStepValid as isProductStepValid} from './ChooseProductStep';
import DateSelect from './DateSelect';
import LocationSelect from './LocationSelect';
import {getProducts} from './ProductSelect';
import SubmitRow from './SubmitRow';
import TimeSelect from './TimeSelect';

// FIXME: check the wizard state - if the user messed with the URLs -> navigate back to
// required preceding step

// TODO: replace with ZOD validation, see #435
export const isStepValid = data => {
  const {location, datetime} = data;
  return isProductStepValid(data) && Boolean(location && datetime);
};

const LocationAndTimeStep = () => {
  const intl = useIntl();
  const {values} = useFormikContext();
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

      <ProductSummary />

      <div>
        <LocationSelect />
        <DateSelect />
        <TimeSelect />
      </div>

      <SubmitRow
        canSubmit={isStepValid(values)}
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
    </>
  );
};

LocationAndTimeStep.propTypes = {};

const ProductSummary = () => {
  const {baseUrl} = useContext(ConfigContext);
  const {
    loading,
    value: allProducts,
    error,
  } = useAsync(async () => await getProducts(baseUrl), [baseUrl]);
  const {
    values: {products},
  } = useFormikContext();

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

ProductSummary.propTypes = {};

export default LocationAndTimeStep;
