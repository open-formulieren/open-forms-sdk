import type {
  AnyComponentSchema,
  BsnComponentSchema,
  DateComponentSchema,
  TextFieldComponentSchema,
} from '@open-formulieren/types';
import {subDays, subYears} from 'date-fns';
import {type MessageDescriptor, defineMessage} from 'react-intl';

type withLocalizedLabel<S extends AnyComponentSchema> = Omit<S, 'label'> & {
  label: MessageDescriptor;
};

const today = new Date();

const CHILDREN_COMPONENTS = [
  {
    id: 'bsn',
    type: 'bsn',
    key: 'bsn' as const,
    label: defineMessage({description: 'Label for children BSN', defaultMessage: 'BSN'}),
    validate: {required: true},
  } satisfies withLocalizedLabel<BsnComponentSchema>,
  {
    id: 'firstNames',
    type: 'textfield',
    key: 'firstNames' as const,
    label: defineMessage({
      description: 'Label for children firstNames',
      defaultMessage: 'Firstnames',
    }),
    validate: {required: true},
  } satisfies withLocalizedLabel<TextFieldComponentSchema>,
  {
    id: 'dateOfBirth',
    type: 'date',
    key: 'dateOfBirth' as const,
    label: defineMessage({
      description: 'Label for children dateOfBirth',
      defaultMessage: 'Date of birth',
    }),
    validate: {
      required: true,
    },
    datePicker: {
      minDate: subYears(today, 120).toISOString(),
      maxDate: subDays(today, 1).toISOString(),
    },
    openForms: {
      widget: 'inputGroup',
      translations: {},
    },
  } satisfies withLocalizedLabel<DateComponentSchema>,
];

export default CHILDREN_COMPONENTS;
