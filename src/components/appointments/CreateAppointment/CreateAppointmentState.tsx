import type {FormikErrors, FormikTouched} from 'formik';
import {produce} from 'immer';
import {useContext, useState} from 'react';
import {useSessionStorage} from 'react-use';

import type {Submission} from '@/data/submissions';
import useSessionTimeout from '@/hooks/useSessionTimeout';

import {CreateAppointmentContext} from '../Context';
import type {AppoinmentStep, AppointmentDataByStep, CreateAppointmentContextType} from '../Context';

export const SESSION_STORAGE_KEY = 'appointment|formData';

type ErrorKeysByStep = {[K in AppoinmentStep]: (keyof AppointmentDataByStep[K])[]};

type AppointmentData = CreateAppointmentContextType['appointmentData'];

const ERROR_KEYS_BY_STEP: ErrorKeysByStep = {
  producten: ['products'],
  kalender: ['location', 'date', 'datetime'],
  contactgegevens: ['contactDetails'],
};

interface BuildContextValueOpts {
  submission: Submission | null;
  currentStep: AppoinmentStep;
  appointmentData: Partial<AppointmentDataByStep>;
  setAppointmentData?: (values: Partial<AppointmentDataByStep>) => void;
  appointmentErrors?: {
    initialTouched: FormikTouched<AppointmentData>;
    initialErrors: FormikErrors<AppointmentData>;
  };
  setAppointmentErrors: (errors: {
    initialTouched: FormikTouched<AppointmentData>;
    initialErrors: FormikErrors<AppointmentData>;
  }) => void;
  resetSession?: () => void;
}

type StepTouched<T extends AppoinmentStep = AppoinmentStep> = FormikTouched<
  AppointmentDataByStep[T]
>;
type StepErrors<T extends AppoinmentStep = AppoinmentStep> = FormikErrors<AppointmentDataByStep[T]>;

const extractStepErrors = (
  currentStep: AppoinmentStep | '',
  errorInformation: {
    initialTouched: FormikTouched<AppointmentData>;
    initialErrors: FormikErrors<AppointmentData>;
  }
): {stepInitialTouched: StepTouched; stepInitialErrors: StepErrors} => {
  const {initialTouched, initialErrors} = errorInformation;

  switch (currentStep) {
    case 'producten': {
      const stepInitialTouched: StepTouched<'producten'> = {};
      const stepInitialErrors: StepErrors<'producten'> = {};
      for (const key of ERROR_KEYS_BY_STEP.producten) {
        const errors = initialErrors[key];
        if (!errors) continue;
        stepInitialErrors[key] = errors;
        // FIXME: there's a type bug here for the recursion of the nested structures
        stepInitialTouched[key] = initialTouched[key];
      }
      return {stepInitialTouched, stepInitialErrors};
    }
    case 'kalender': {
      const stepInitialTouched: StepTouched<'kalender'> = {};
      const stepInitialErrors: StepErrors<'kalender'> = {};
      for (const key of ERROR_KEYS_BY_STEP.kalender) {
        const errors = initialErrors[key];
        if (!errors) continue;
        stepInitialErrors[key] = errors;
        stepInitialTouched[key] = initialTouched[key];
      }
      return {stepInitialTouched, stepInitialErrors};
    }
    case 'contactgegevens': {
      const stepInitialTouched: StepTouched<'contactgegevens'> = {};
      const stepInitialErrors: StepErrors<'contactgegevens'> = {};
      for (const key of ERROR_KEYS_BY_STEP.contactgegevens) {
        const errors = initialErrors[key];
        if (!errors) continue;
        // FIXME: there's a type bug here for the recursion of the nested structures
        stepInitialErrors[key] = errors;
        stepInitialTouched[key] = initialTouched[key];
      }
      return {stepInitialTouched, stepInitialErrors};
    }
    case '': {
      return {stepInitialTouched: {}, stepInitialErrors: {}};
    }
    default: {
      const exhaustiveCheck: never = currentStep;
      throw new Error(`Unknown 'step' value: ${exhaustiveCheck}`);
    }
  }
};

export const buildContextValue = ({
  submission,
  currentStep,
  appointmentData,
  setAppointmentData = () => {},
  appointmentErrors = {initialTouched: {}, initialErrors: {}},
  setAppointmentErrors = () => {},
  resetSession = () => {},
}: BuildContextValueOpts): CreateAppointmentContextType => {
  const submittedSteps = (Object.keys(appointmentData) as AppoinmentStep[]).filter(
    subObject => Object.keys(subObject).length
  );
  const mergedAppointmentData: AppointmentData = (
    Object.keys(appointmentData) as AppoinmentStep[]
  ).reduce((accumulator, key) => {
    const stepData = appointmentData[key];
    if (!stepData) return accumulator;
    return {...accumulator, ...stepData};
  }, {} satisfies AppointmentData);

  const errorKeys = ERROR_KEYS_BY_STEP[currentStep] || [];
  const {initialTouched = {}, initialErrors = {}} = appointmentErrors;

  // filter out the errors that are relevant for the current step only
  const {stepInitialTouched, stepInitialErrors} = extractStepErrors(currentStep, appointmentErrors);

  return {
    submission,
    appointmentData: mergedAppointmentData,
    stepData: appointmentData[currentStep] || {},
    submittedSteps,
    submitStep: values => setAppointmentData({...appointmentData, [currentStep]: values}),
    setErrors: setAppointmentErrors,
    stepErrors: {initialTouched: stepInitialTouched, initialErrors: stepInitialErrors},
    clearStepErrors: () => {
      const newInitialErrors = produce(initialErrors, draft => {
        errorKeys.forEach(key => delete draft[key]);
      });
      setAppointmentErrors({initialTouched, initialErrors: newInitialErrors});
    },
    reset: () => {
      setAppointmentData({});
      resetSession();
    },
  };
};

export interface CreateAppointmentStateProps {
  currentStep: AppoinmentStep;
  submission: Submission | null;
  resetSession: () => void;
  children: React.ReactNode;
}

export const CreateAppointmentState: React.FC<CreateAppointmentStateProps> = ({
  currentStep,
  submission,
  resetSession,
  children,
}) => {
  const [appointmentData, setAppointmentData] = useSessionStorage<Partial<AppointmentDataByStep>>(
    SESSION_STORAGE_KEY,
    {}
  );
  const [appointmentErrors, setAppointmentErrors] = useState({
    initialTouched: {},
    initialErrors: {},
  });

  // check if the session is expired
  useSessionTimeout();

  const contextValue = buildContextValue({
    submission,
    currentStep,
    appointmentData,
    setAppointmentData,
    appointmentErrors,
    setAppointmentErrors,
    resetSession,
  });

  return (
    <CreateAppointmentContext.Provider value={contextValue}>
      {children}
    </CreateAppointmentContext.Provider>
  );
};

export function useCreateAppointmentContext<S extends AppoinmentStep = AppoinmentStep>() {
  const context = useContext(CreateAppointmentContext);
  // can't provide generic type argument, so we must cast
  return context as CreateAppointmentContextType<S>;
}

export default CreateAppointmentState;
