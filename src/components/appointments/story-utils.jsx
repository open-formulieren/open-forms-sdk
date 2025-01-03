import {CreateAppointmentContext} from './Context';
import {buildContextValue} from './CreateAppointment/CreateAppointmentState';

export const withAppointmentState = (Story, {parameters}) => {
  const state = parameters?.appointmentState;
  const {appointmentData = {}, currentStep = 'producten', submission, appointmentErrors} = state;
  const contextValue = buildContextValue({
    submission,
    currentStep,
    appointmentData,
    appointmentErrors,
  });
  return (
    <CreateAppointmentContext.Provider value={contextValue}>
      <Story />
    </CreateAppointmentContext.Provider>
  );
};
