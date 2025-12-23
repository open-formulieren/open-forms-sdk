import {DateField} from '@open-formulieren/formio-renderer';
import {Paragraph} from '@utrecht/component-library-react';
import {eachDayOfInterval, formatISO, parseISO} from 'date-fns';
import {useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, defineMessage, useIntl} from 'react-intl';
import type {MessageDescriptor} from 'react-intl';
import {useAsync} from 'react-use';

import {ConfigContext} from '@/Context';
import {get} from '@/api';
import type {AppointmentDate, AppointmentProduct} from '@/data/appointments';

import type {LocationAndTimeStepValues} from '../steps/LocationAndTimeStep';
import {prepareProductsForProductIDQuery} from '../utils';

export const fieldLabel: MessageDescriptor = defineMessage({
  description: 'Appoinments: appointment date label',
  defaultMessage: 'Date',
});

const getDates = async (
  baseUrl: string,
  productIds: string[],
  locationId: string
): Promise<string[]> => {
  if (!productIds.length || !locationId) return [];
  const multiParams = productIds.map(id => ({product_id: id}));
  const datesList = await get<AppointmentDate[]>(
    `${baseUrl}appointments/dates`,
    {location_id: locationId},
    multiParams
  );
  const results = datesList!.map(item => item.date);
  // Array.prototype.toSorted is too new, jest tests can't handle it yet
  return results.sort();
};

export interface DateSelectProps {
  products: AppointmentProduct[];
}

const DateSelect: React.FC<DateSelectProps> = ({products}) => {
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const {
    values: {location},
  } = useFormikContext<LocationAndTimeStepValues>();

  // get the available dates from the API
  const productIds = prepareProductsForProductIDQuery(products);

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
      <Paragraph>
        <FormattedMessage
          description="Appoinments: message shown for no available dates at all"
          defaultMessage="Sorry, there are no available dates for your appointment. Please try again later."
        />
      </Paragraph>
    );
  }

  const today = new Date();
  const minDate = availableDates.length ? parseISO(availableDates[0]) : today;
  const maxDate = availableDates.length ? parseISO(availableDates.at(-1)!) : today;
  const possibleDays = eachDayOfInterval({start: minDate, end: maxDate}).map(d =>
    formatISO(d, {representation: 'date'})
  );

  const disabledDates = possibleDays.filter(date => !availableDates.includes(date));

  return (
    <DateField
      name="date"
      label={intl.formatMessage(fieldLabel)}
      isRequired
      isReadOnly={loading || !location}
      widget="datePicker"
      widgetProps={{minDate, maxDate, disabledDates}}
    />
  );
};

export default DateSelect;
