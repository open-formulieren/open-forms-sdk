import {format, parseISO} from 'date-fns';
import {useFormikContext} from 'formik';
import React, {useCallback, useContext} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from 'Context';
import {get} from 'api';
import {AsyncSelectField} from 'components/forms';
import {useCalendarLocale} from 'components/forms/DateField';

import {ProductsType} from './types';

const getDatetimes = async (baseUrl, productIds, locationId, date) => {
  if (!productIds.length || !locationId || !date) return [];
  const multiParams = productIds.map(id => ({product_id: id}));
  const datetimesList = await get(
    `${baseUrl}appointments/times`,
    {location_id: locationId, date: date},
    multiParams
  );

  return datetimesList.map(item => item.time);
};

const TimeSelect = ({products}) => {
  const {baseUrl} = useContext(ConfigContext);
  const {
    values: {location, date},
  } = useFormikContext();
  const calendarLocale = useCalendarLocale();

  const productIds = products.map(prod => prod.productId).sort(); // sort to get a stable identity

  const getOptions = useCallback(
    async () => {
      const results = await getDatetimes(baseUrl, productIds, location, date);
      // Array.prototype.toSorted is too new, jest tests can't handle it yet
      return results
        .map(datetime => {
          const parsed = parseISO(datetime);
          return {
            parsed,
            value: datetime,
            // p: long localized time, without seconds
            label: format(parsed, 'p', {locale: calendarLocale}),
          };
        })
        .sort((a, b) => {
          if (a.parsed < b.parsed) return -1;
          if (a.parsed > b.parsed) return 1;
          return 0;
        });
    },
    // about JSON.stringify: https://github.com/facebook/react/issues/14476#issuecomment-471199055
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseUrl, calendarLocale, JSON.stringify(productIds), location, date]
  );

  return (
    <AsyncSelectField
      name="datetime"
      isRequired
      disabled={!products || !products.length || !location || !date}
      label={
        <FormattedMessage description="Appoinments: time select label" defaultMessage="Time" />
      }
      description={
        <FormattedMessage
          description="Appoinments: time select help text"
          defaultMessage="Times are in your local time"
        />
      }
      getOptions={getOptions}
      autoSelectOnlyOption
      validateOnChange
    />
  );
};

TimeSelect.propTypes = {
  products: ProductsType.isRequired,
};

export default TimeSelect;
