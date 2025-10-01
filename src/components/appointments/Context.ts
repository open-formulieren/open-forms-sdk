import type {FormikErrors, FormikTouched} from 'formik';
import React from 'react';

import type {Submission} from '@/data/submissions';

import type {AppoinmentStep, AppointmentData, AppointmentDataByStep} from './types';

export interface AppointmentConfigContext {
  supportsMultipleProducts: boolean;
}

const AppointmentConfigContext = React.createContext<AppointmentConfigContext>({
  supportsMultipleProducts: true,
});
AppointmentConfigContext.displayName = 'AppointmentConfigContext';

export interface CreateAppointmentContextType<S extends AppoinmentStep = AppoinmentStep> {
  submission: Submission | null;
  appointmentData: Partial<AppointmentData>;
  stepData: Partial<AppointmentDataByStep[S]>;
  submittedSteps: AppoinmentStep[];
  submitStep: (values: AppointmentDataByStep[S]) => void;
  setErrors: (errors: {
    initialTouched: FormikTouched<AppointmentDataByStep[S]>;
    initialErrors: FormikErrors<AppointmentDataByStep[S]>;
  }) => void;
  stepErrors: {
    initialTouched: FormikTouched<AppointmentDataByStep[S]>;
    initialErrors: FormikErrors<AppointmentDataByStep[S]>;
  };
  clearStepErrors: () => void;
  reset: () => void;
}

const CreateAppointmentContext = React.createContext<CreateAppointmentContextType>({
  submission: null,
  appointmentData: {},
  stepData: {},
  submittedSteps: [],
  submitStep: () => {},
  setErrors: () => {},
  stepErrors: {initialTouched: {}, initialErrors: {}},
  clearStepErrors: () => {},
  reset: () => window.sessionStorage.clear(),
});
CreateAppointmentContext.displayName = 'CreateAppointmentContext';

export {AppointmentConfigContext, CreateAppointmentContext};
