import produce from 'immer';
import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import {useSessionStorage} from 'react-use';

import useSessionTimeout from 'hooks/useSessionTimeout';
import Types from 'types';

import {CreateAppointmentContext} from '../Context';

export const SESSION_STORAGE_KEY = 'appointment|formData';

const errorKeysByStep = {
  producten: ['products'],
  kalender: ['location', 'date', 'datetime'],
  contactgegevens: ['contactDetails'],
};

export const buildContextValue = ({
  submission,
  currentStep,
  appointmentData,
  setAppointmentData = () => {},
  appointmentErrors = {initialTouched: {}, initialErrors: {}},
  setAppointmentErrors = () => {},
  resetSession = () => {},
  processingError = '',
  setProcessingError = () => {},
}) => {
  const submittedSteps = Object.keys(appointmentData).filter(
    subObject => Object.keys(subObject).length
  );
  const mergedAppointmentData = Object.keys(appointmentData).reduce(
    (accumulator, key) => ({...accumulator, ...appointmentData[key]}),
    {}
  );

  const errorKeys = errorKeysByStep[currentStep] || [];
  const {initialTouched, initialErrors} = appointmentErrors;

  const stepInitialTouched = {};
  const stepInitialErrors = {};
  errorKeys.forEach(key => {
    const errors = initialErrors[key];
    if (!errors) return;
    stepInitialErrors[key] = errors;
    stepInitialTouched[key] = initialTouched[key];
  });

  return {
    submission,
    appointmentData: mergedAppointmentData,
    stepData: appointmentData[currentStep] || {},
    submittedSteps,
    submitStep: values => setAppointmentData({...appointmentData, [currentStep]: values}),
    setErrors: setAppointmentErrors,
    stepErrors: {initialTouched: stepInitialTouched, initialErrors: stepInitialErrors},
    processingError,
    setProcessingError,
    clearStepErrors: () => {
      const newInitialErrors = produce(initialErrors, draft => {
        errorKeys.forEach(key => delete draft[key]);
      });
      setAppointmentErrors({initialTouched, initialErrors: newInitialErrors});
    },
    reset: () => {
      setProcessingError('');
      setAppointmentData({});
      resetSession();
    },
  };
};

export const CreateAppointmentState = ({currentStep, submission, resetSession, children}) => {
  const [appointmentData, setAppointmentData] = useSessionStorage(SESSION_STORAGE_KEY, {});
  const [appointmentErrors, setAppointmentErrors] = useState({
    initialTouched: {},
    initialErrors: {},
  });
  const [processingError, setProcessingError] = useState('');

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
    processingError,
    setProcessingError,
  });

  return (
    <CreateAppointmentContext.Provider value={contextValue}>
      {children}
    </CreateAppointmentContext.Provider>
  );
};

CreateAppointmentState.propTypes = {
  currentStep: PropTypes.string.isRequired,
  submission: Types.Submission,
  resetSession: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export const useCreateAppointmentContext = () => useContext(CreateAppointmentContext);

export default CreateAppointmentState;
