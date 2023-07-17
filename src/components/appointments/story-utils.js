import {CreateAppointmentContext} from './Context';
import {buildContextValue} from './CreateAppointment/CreateAppointmentState';

export const withAppointmentState = (Story, {parameters}) => {
  const {
    appointmentData = {},
    currentStep = 'producten',
    submission,
  } = parameters?.appointmentState;
  const contextValue = buildContextValue(submission, currentStep, appointmentData);
  return (
    <CreateAppointmentContext.Provider value={contextValue}>
      <Story />
    </CreateAppointmentContext.Provider>
  );
};
