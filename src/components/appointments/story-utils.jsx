import {CreateAppointmentContext} from './Context';
import {buildContextValue} from './CreateAppointment/CreateAppointmentState';

export const withAppointmentState = (Story, {parameters}) => {
  const {
    appointmentData = {},
    currentStep = 'producten',
    submission,
    appointmentErrors,
  } = parameters?.appointmentState;
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
