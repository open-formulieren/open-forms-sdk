import {
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

const PARTNER_COMPONENTS = [
  {
    id: 'bsn',
    type: 'bsn',
    key: 'bsn' as const,
    label: defineMessage({description: 'Label for partners BSN', defaultMessage: 'BSN'}),
    validate: {required: true},
    validateOn: 'blur',
    inputMask: '999999999',
  } satisfies withLocalizedLabel<BsnComponentSchema>,
  {
    id: 'initials',
    type: 'textfield',
    key: 'initials' as const,
    label: defineMessage({description: 'Label for partners initials', defaultMessage: 'Initials'}),
    validate: {required: false},
  } satisfies withLocalizedLabel<TextFieldComponentSchema>,
  {
    id: 'affixes',
    type: 'textfield',
    key: 'affixes' as const,
    label: defineMessage({description: 'Label for partners affixes', defaultMessage: 'Affixes'}),
    validate: {required: false},
  } satisfies withLocalizedLabel<TextFieldComponentSchema>,
  {
    id: 'lastName',
    type: 'textfield',
    key: 'lastName' as const,
    label: defineMessage({description: 'Label for partners lastName', defaultMessage: 'Lastname'}),
    validate: {required: true},
  } satisfies withLocalizedLabel<TextFieldComponentSchema>,
  {
    id: 'dateOfBirth',
    type: 'date',
    key: 'dateOfBirth' as const,
    label: defineMessage({
      description: 'Label for partners dateOfBirth',
      defaultMessage: 'Date of birth',
    }),
    validate: {
      required: true,
    },
    datePicker: {
      minDate: subYears(today, 120).toISOString(),
      maxDate: subDays(today, 1).toISOString(),
      // ignored, but required in the type defs
      showWeeks: false,
      startingDay: 0,
      initDate: '',
      minMode: 'day',
      maxMode: 'year',
      yearRows: 1,
      yearColumns: 1,
    },
    openForms: {
      widget: 'inputGroup',
      translations: {},
    },
  } satisfies withLocalizedLabel<DateComponentSchema>,
];

export default PARTNER_COMPONENTS;
