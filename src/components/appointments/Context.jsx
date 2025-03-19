import React from 'react';

const AppointmentConfigContext = React.createContext({supportsMultipleProducts: true});
AppointmentConfigContext.displayName = 'AppointmentConfigContext';

const CreateAppointmentContext = React.createContext({
  submission: null,
  appointmentData: {},
  stepData: {},
  submittedSteps: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  submitStep: values => {},
  setErrors: () => {},
  stepErrors: {initialTouched: {}, initialErrors: {}},
  processingError: '',
  setProcessingError: () => {},
  clearStepErrors: () => {},
  reset: () => window.sessionStorage.clear(),
});
CreateAppointmentContext.displayName = 'CreateAppointmentContext';

export {AppointmentConfigContext, CreateAppointmentContext};
