import {withRouter} from 'storybook-addon-react-router-v6';

import {ConfigDecorator, FormikDecorator, LayoutDecorator, withCard} from 'story-utils/decorators';

import LocationAndTimeStep from './LocationAndTimeStep';
import {
  mockAppointmentDatesGet,
  mockAppointmentLocationsGet,
  mockAppointmentProductsGet,
  mockAppointmentTimesGet,
} from './mocks';

export default {
  title: 'Private API / Appointments / Steps / 2 - Location and time',
  component: LocationAndTimeStep,
  decorators: [withCard, LayoutDecorator, FormikDecorator, withRouter, ConfigDecorator],
  parameters: {
    controls: {hideNoControlsWarning: true},
    formik: {
      initialValues: {
        products: [{productId: '166a5c79', amount: 1}],
        location: '',
        date: '',
        datetime: '',
      },
    },
    msw: {
      handlers: [
        mockAppointmentProductsGet,
        mockAppointmentLocationsGet,
        mockAppointmentDatesGet,
        mockAppointmentTimesGet,
      ],
    },
  },
};

export const InitialState = {
  name: 'Initial state',
};
