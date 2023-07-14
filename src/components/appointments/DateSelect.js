import {Paragraph} from '@utrecht/component-library-react';
import {eachDayOfInterval, formatISO, parseISO} from 'date-fns';
import {useFormikContext} from 'formik';
import React, {useContext} from 'react';
import {FormattedMessage} from 'react-intl';
import {useAsync} from 'react-use';

import {ConfigContext} from 'Context';
import {get} from 'api';
import {DateField} from 'components/forms';

import {ProductsType} from './types';

const getDates = async (baseUrl, productIds, locationId) => {
  if (!productIds.length || !locationId) return [];
  const multiParams = productIds.map(id => ({product_id: id}));
  const datesList = await get(
    `${baseUrl}appointments/dates`,
    {location_id: locationId},
    multiParams
  );
  const results = datesList.map(item => item.date);
  // Array.prototype.toSorted is too new, jest tests can't handle it yet
  return results.sort();
};

const DateSelect = ({products}) => {
  const {baseUrl} = useContext(ConfigContext);
  const {
    values: {location},
  } = useFormikContext();

  // get the available dates from the API
  const productIds = products.map(prod => prod.productId).sort(); // sort to get a stable identity

  const {
    loading,
    value: availableDates = [],
    error,
  } = useAsync(
    async () => await getDates(baseUrl, productIds, location),
    // about JSON.stringify: https://github.com/facebook/react/issues/14476#issuecomment-471199055
    [baseUrl, JSON.stringify(productIds), location]
  );

  if (error) {
    throw error;
  }

  if (!loading && location && availableDates && !availableDates.length) {
    // TODO: add label? make this a polite warning/error/alert?
    return (
      <div className="openforms-form-control">
        <Paragraph>
          <FormattedMessage
            description="Appoinments: message shown for no available dates at all"
            defaultMessage="Sorry, there are no available dates for your appointment. Please try again later."
          />
        </Paragraph>
      </div>
    );
  }

  const today = new Date();
  const minDate = availableDates.length ? parseISO(availableDates[0]) : today;
  const maxDate = availableDates.length ? parseISO(availableDates.at(-1)) : today;
  const possibleDays = eachDayOfInterval({start: minDate, end: maxDate}).map(d =>
    formatISO(d, {representation: 'date'})
  );

  const disabledDays = possibleDays.filter(date => !availableDates.includes(date));

  return (
    <DateField
      name="date"
      widget="datepicker"
      disabled={loading || !location}
      isRequired
      label={
        <FormattedMessage description="Appoinments: appointment date label" defaultMessage="Date" />
      }
      disabledDates={disabledDays}
      minDate={minDate}
      maxDate={maxDate}
    />
  );
};

DateSelect.propTypes = {
  products: ProductsType.isRequired,
};

export default DateSelect;
