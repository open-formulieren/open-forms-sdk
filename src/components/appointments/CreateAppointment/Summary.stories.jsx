import {withRouter} from 'storybook-addon-remix-react-router';

import {buildSubmission} from 'api-mocks/submissions';
import {
  ConfigDecorator,
  LayoutDecorator,
  LiteralDecorator,
  withCard,
  withForm,
} from 'story-utils/decorators';

import {
  mockAppointmentCustomerFieldsGet,
  mockAppointmentLocationsGet,
  mockAppointmentPost,
  mockAppointmentProductsGet,
} from '../mocks';
import {withAppointmentState} from '../story-utils';
import Summary from './Summary';

export default {
  title: 'Private API / Appointments / Steps / 4 - Summary',
  component: Summary,
  decorators: [
    withCard,
    LayoutDecorator,
    withAppointmentState,
    LiteralDecorator,
    withForm,
    withRouter,
    ConfigDecorator,
  ],
  parameters: {
    controls: {hideNoControlsWarning: true},
    appointmentState: {
      submission: buildSubmission(),
      currentStep: '',
      appointmentData: {
        producten: {
          products: [{productId: '166a5c79', amount: 1}],
        },
        kalender: {
          location: '1396f17c',
          date: '2023-07-12',
          datetime: `2023-07-12T08:00:00Z`,
        },
        contactgegevens: {
          lastName: 'Kundera',
          dateOfBirth: '1929-04-01',
          email: 'milan@kundera.cz',
          phone: '12345678',
          bsn: '123456782',
          gender: 'M',
        },
      },
    },
    msw: {
      handlers: [
        mockAppointmentProductsGet,
        mockAppointmentLocationsGet,
        mockAppointmentCustomerFieldsGet,
        mockAppointmentPost,
      ],
    },
  },
  args: {
    // LiteralDecorator args
    confirmText: 'Confirm',
    previousText: 'Previous',
    changeText: 'Change',
  },
};

export const Default = {};

export const MultipleProducts = {
  parameters: {
    appointmentState: {
      submission: buildSubmission(),
      currentStep: '',
      appointmentData: {
        producten: {
          products: [
            {productId: '166a5c79', amount: 1},
            {productId: 'e8e045ab', amount: 2},
          ],
        },
        kalender: {
          location: '1396f17c',
          date: '2023-07-12',
          datetime: `2023-07-12T08:00:00Z`,
        },
        contactgegevens: {
          lastName: 'Kundera',
          dateOfBirth: '1929-04-01',
          email: 'milan@kundera.cz',
          phone: '12345678',
          bsn: '123456782',
          gender: 'M',
        },
      },
    },
  },
};
