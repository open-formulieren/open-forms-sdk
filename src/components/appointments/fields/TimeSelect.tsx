import {isValid, parseISO} from 'date-fns';
import {useFormikContext} from 'formik';
import {useCallback, useContext} from 'react';
import {defineMessage, useIntl} from 'react-intl';
import type {MessageDescriptor} from 'react-intl';

import {ConfigContext} from '@/Context';
import {get} from '@/api';
import AsyncSelectField from '@/components/forms/SelectField/AsyncSelectField';
import type {AppointmentProduct, AppointmentTime} from '@/data/appointments';

import type {LocationAndTimeStepValues} from '../steps/LocationAndTimeStep';
import {prepareProductsForProductIDQuery} from '../utils';

export const fieldLabel: MessageDescriptor = defineMessage({
  description: 'Appoinments: time select label',
  defaultMessage: 'Time',
});

const getDatetimes = async (
  baseUrl: string,
  productIds: string[],
  locationId: string,
  date: string
): Promise<string[]> => {
  if (!productIds.length || !locationId || !isValid(parseISO(date))) return [];
  const multiParams = productIds.map(id => ({product_id: id}));
  const datetimesList = await get<AppointmentTime[]>(
    `${baseUrl}appointments/times`,
    {location_id: locationId, date: date},
    multiParams
  );

  return datetimesList!.map(item => item.time);
};

export interface TimeSelectProps {
  products: AppointmentProduct[];
}

const TimeSelect: React.FC<TimeSelectProps> = ({products}) => {
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const {
    values: {location, date},
  } = useFormikContext<LocationAndTimeStepValues>();

  const productIds = prepareProductsForProductIDQuery(products);

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
            label: intl.formatTime(parsed),
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
    [baseUrl, intl, JSON.stringify(productIds), location, date]
  );

  return (
    <AsyncSelectField
      name="datetime"
      isRequired
      isDisabled={!products || !products.length || !location || !date}
      label={intl.formatMessage(fieldLabel)}
      getOptions={getOptions}
      autoSelectOnlyOption
    />
  );
};

export default TimeSelect;
