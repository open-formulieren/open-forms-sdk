// Calendar component documentation:
// https://nl-design-system.github.io/utrecht/storybook-react/index.html?path=/docs/react-component-calendar--docs
import {Calendar} from '@utrecht/component-library-react/dist/Calendar.mjs';
import {enGB, nl} from 'date-fns/locale';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

// FIXME: together with src/i18n.js, see how we can make this a dynamic import without
// breaking the bundles/cache busting mechanisms.
export const loadCalendarLocale = locale => {
  switch (locale) {
    case 'nl':
      return nl;
    default:
      return enGB;
  }
};

const DatePickerCalendar = props => {
  const locale = useCalendarLocale();
  return (
    <Calendar
      locale={locale}
      previousYearButtonTitle={
        <FormattedMessage
          description="Calendar: previous year button title"
          defaultMessage="Previous year"
        />
      }
      nextYearButtonTitle={
        <FormattedMessage
          description="Calendar: next year button title"
          defaultMessage="Next year"
        />
      }
      previousMonthButtonTitle={
        <FormattedMessage
          description="Calendar: previous month button title"
          defaultMessage="Previous month"
        />
      }
      nextMonthButtonTitle={
        <FormattedMessage
          description="Calendar: next month button title"
          defaultMessage="Next month"
        />
      }
      {...props}
    />
  );
};

export const useCalendarLocale = () => {
  const intl = useIntl();
  const locale = loadCalendarLocale(intl.locale);
  return locale;
};

export default DatePickerCalendar;
