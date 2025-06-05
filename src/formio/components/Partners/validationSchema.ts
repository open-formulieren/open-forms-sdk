import {getRegistryEntry} from '@open-formulieren/formio-renderer/registry/registry.js';
import {buildValidationSchema} from '@open-formulieren/formio-renderer/validationSchema.js';
import type {IntlShape} from 'react-intl';

const PARTNER_COMPONENTS = [
  {
    id: 'bsn',
    type: 'bsn',
    key: 'bsn',
    label: 'bsn',
    validate: {required: true},
  },
  {
    id: 'initials',
    type: 'textfield',
    key: 'initials',
    label: 'initials',
    validate: {required: false},
  },
  {
    id: 'affixes',
    type: 'textfield',
    key: 'affixes',
    label: 'affixes',
    validate: {required: false},
  },
  {
    id: 'lastName',
    type: 'textfield',
    key: 'lastName',
    label: 'lastName',
    validate: {required: true},
  },
  {
    id: 'dateOfBirth',
    type: 'date',
    key: 'dateOfBirth',
    label: 'dateOfBirth',
    validate: {required: true},
  },
];

const getValidationSchema = (intl: IntlShape) => {
  return buildValidationSchema(PARTNER_COMPONENTS, intl, getRegistryEntry);
};

export default getValidationSchema;
