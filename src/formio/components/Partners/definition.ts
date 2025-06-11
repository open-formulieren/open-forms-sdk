import {subDays, subYears} from 'date-fns';
import {defineMessage} from 'react-intl';

const today = new Date();

const PARTNER_COMPONENTS = [
  {
    id: 'bsn',
    type: 'bsn',
    key: 'bsn',
    label: defineMessage({description: 'Label for partners BSN', defaultMessage: 'BSN'}),
    validate: {required: true},
  },
  {
    id: 'initials',
    type: 'textfield',
    key: 'initials',
    label: defineMessage({description: 'Label for partners initials', defaultMessage: 'Initials'}),
    validate: {required: false},
  },
  {
    id: 'affixes',
    type: 'textfield',
    key: 'affixes',
    label: defineMessage({description: 'Label for partners affixes', defaultMessage: 'Affixes'}),
    validate: {required: false},
  },
  {
    id: 'lastName',
    type: 'textfield',
    key: 'lastName',
    label: defineMessage({description: 'Label for partners lastName', defaultMessage: 'Lastname'}),
    validate: {required: true},
  },
  {
    id: 'dateOfBirth',
    type: 'date',
    key: 'dateOfBirth',
    label: defineMessage({
      description: 'Label for partners dateOfBirth',
      defaultMessage: 'Date of birth',
    }),
    validate: {
      required: true,
      minDate: subYears(today, 120).toISOString(),
      maxDate: subDays(today, 1).toISOString(),
    },
  },
];

export default PARTNER_COMPONENTS;
