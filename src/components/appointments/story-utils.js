import {CreateAppointmentContext} from './Context';

export const withAppointmentState = (Story, {parameters}) => {
  const {
    appointmentData = {},
    currentStep = 'producten',
    submission,
  } = parameters?.appointmentState;
  const mergedAppointmentData = Object.keys(appointmentData).reduce(
    (accumulator, key) => ({...accumulator, ...appointmentData[key]}),
    {}
  );
  return (
    <CreateAppointmentContext.Provider
      value={{
        submission,
        appointmentData: mergedAppointmentData,
        stepData: appointmentData[currentStep] || {},
        submittedSteps: [],
        submitStep: () => {},
      }}
    >
      <Story />
    </CreateAppointmentContext.Provider>
  );
};
