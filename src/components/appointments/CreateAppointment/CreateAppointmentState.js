import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {useSessionStorage} from 'react-use';

import {CreateAppointmentContext} from '../Context';

const SESSION_STORAGE_KEY = 'appointment|formData';

export const CreateAppointmentState = ({currentStep, children}) => {
  const [appointmentData, setAppointmentData] = useSessionStorage(SESSION_STORAGE_KEY, {});
  const submittedSteps = Object.keys(appointmentData).filter(
    subObject => Object.keys(subObject).length
  );
  const mergedAppointmentData = Object.keys(appointmentData).reduce(
    (accumulator, key) => ({...accumulator, ...appointmentData[key]}),
    {}
  );
  return (
    <CreateAppointmentContext.Provider
      value={{
        appointmentData: mergedAppointmentData,
        stepData: appointmentData[currentStep] || {},
        submittedSteps,
        submitStep: values => setAppointmentData({...appointmentData, [currentStep]: values}),
      }}
    >
      {children}
    </CreateAppointmentContext.Provider>
  );
};

CreateAppointmentState.propTypes = {
  currentStep: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export const useCreateAppointmentContext = () => useContext(CreateAppointmentContext);

export default CreateAppointmentState;
