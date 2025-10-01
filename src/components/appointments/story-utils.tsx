import type {Decorator} from '@storybook/react';

import {CreateAppointmentContext} from './Context';
import {buildContextValue} from './CreateAppointment/CreateAppointmentState';

export const withAppointmentState: Decorator = (Story, {parameters}) => {
  // parameters are 'any' typed so adding extra information is a bit challenging :grimacing:
  const state = parameters?.appointmentState;
  const {appointmentData = {}, currentStep = 'producten', submission, appointmentErrors} = state;
  const contextValue = buildContextValue({
    submission,
    currentStep,
    appointmentData,
    appointmentErrors,
    setAppointmentErrors: () => {},
  });
  return (
    <CreateAppointmentContext.Provider value={contextValue}>
      <Story />
    </CreateAppointmentContext.Provider>
  );
};
