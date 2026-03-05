import {render, screen} from '@testing-library/react';
import {IntlProvider} from 'react-intl';
import {MemoryRouter} from 'react-router';

import type {StepSummaryData} from '@/data/submissions';
import messagesNL from '@/i18n/compiled/nl.json';

import FormStepSummary from './FormStepSummary';

const Wrap: React.FC<{children: React.ReactNode}> = ({children}) => (
  <IntlProvider locale="nl" messages={messagesNL}>
    <MemoryRouter>{children}</MemoryRouter>
  </IntlProvider>
);

const EMPTY_FIELDS: StepSummaryData['data'] = [
  {
    name: 'Amount to Pay',
    value: null,
    component: {
      id: 'component1',
      key: 'amountToPay',
      type: 'currency',
      label: 'Amount to Pay',
      currency: 'EUR',
    },
  },
  {
    name: 'Number of people',
    value: null,
    component: {
      id: 'component1',
      key: 'nPeople',
      type: 'number',
      label: 'Number of people',
    },
  },
  {
    name: 'Upload File',
    value: [],
    component: {
      id: 'component1',
      key: 'uploadFile',
      type: 'file',
      label: 'Upload File',
      multiple: false,
      file: {name: '', type: [], allowedTypesLabels: []},
      filePattern: '*/*',
    },
  },
  {
    name: 'Upload File Multiple',
    value: [],
    component: {
      id: 'component1',
      key: 'uploadFileMultiple',
      type: 'file',
      label: 'Upload File Multiple',
      multiple: true,
      file: {name: '', type: [], allowedTypesLabels: []},
      filePattern: '*/*',
    },
  },
  {
    name: 'Upload File',
    value: [null],
    component: {
      id: 'component1',
      key: 'uploadFile1',
      type: 'file',
      label: 'Upload File',
      multiple: true,
      file: {name: '', type: [], allowedTypesLabels: []},
      filePattern: '*/*',
    },
  },
  {
    name: 'Select boxes',
    value: null,
    component: {
      id: 'component1',
      key: 'selectBoxes',
      type: 'selectboxes',
      label: 'Select boxes',
      values: [],
      defaultValue: {},
      openForms: {translations: {}, dataSrc: 'manual'},
    },
  },
  {
    name: 'Radio button',
    value: null,
    component: {
      id: 'component1',
      key: 'radioButton',
      type: 'radio',
      label: 'Radio button',
      values: [],
      defaultValue: '',
      openForms: {translations: {}, dataSrc: 'manual'},
    },
  },
  {
    name: 'Select field',
    value: null,
    component: {
      id: 'component1',
      key: 'select',
      type: 'select',
      label: 'Select field',
      multiple: false,
      data: {values: []},
      openForms: {translations: {}, dataSrc: 'manual'},
    },
  },
];

test.each(EMPTY_FIELDS)('Empty fields (%s)', dataEntry => {
  render(
    <Wrap>
      <FormStepSummary
        name="Form Step 1"
        editUrl="/stap/fs-1"
        editStepText="Change"
        data={[dataEntry]}
      />
    </Wrap>
  );

  expect(screen.getByRole('definition')).toHaveTextContent('');
});
