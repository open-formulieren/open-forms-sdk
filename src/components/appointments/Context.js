import React from 'react';

const AppointmentConfigContext = React.createContext({supportsMultipleProducts: true});
AppointmentConfigContext.displayName = 'AppointmentConfigContext';

const CreateAppointmentContext = React.createContext({
  submission: null,
  appointmentData: {},
  stepData: {},
  submittedSteps: [],
  submitStep: () => {},
});
CreateAppointmentContext.displayName = 'CreateAppointmentContext';

export {AppointmentConfigContext, CreateAppointmentContext};
