import React from 'react';
import {Outlet, useLocation} from 'react-router-dom';

import Card from 'components/Card';
import ErrorBoundary from 'components/Errors/ErrorBoundary';
import FormDisplay from 'components/FormDisplay';
import {LiteralsProvider} from 'components/Literal';
import Loader from 'components/Loader';
import {SessionTrackerModal} from 'components/Sessions';
import {checkMatchesPath} from 'components/utils/routers';
import useFormContext from 'hooks/useFormContext';
import useGetOrCreateSubmission from 'hooks/useGetOrCreateSubmission';
import useSessionTimeout from 'hooks/useSessionTimeout';

import {AppointmentConfigContext} from '../Context';
import AppointmentProgress from './AppointmentProgress';
import CreateAppointmentState from './CreateAppointmentState';
import {APPOINTMENT_STEP_PATHS} from './routes';

const useIsConfirmation = () => {
  // useMatch requires absolute paths... and react-router are NOT receptive to changing that.
  const {pathname} = useLocation();
  return checkMatchesPath(pathname, 'bevestiging');
};

const CreateAppointment = () => {
  const form = useFormContext();
  const {pathname} = useLocation();

  const skipSubmissionCreation = useIsConfirmation();
  const {
    isLoading,
    error,
    submission,
    clear: clearSubmission,
  } = useGetOrCreateSubmission(form, skipSubmissionCreation);
  if (error) throw error;

  const [, expiryDate, resetSession] = useSessionTimeout();

  const supportsMultipleProducts = form?.appointmentOptions.supportsMultipleProducts ?? false;

  const currentStep =
    APPOINTMENT_STEP_PATHS.find(step => checkMatchesPath(pathname, step)) ||
    APPOINTMENT_STEP_PATHS[0];

  const reset = () => {
    clearSubmission();
    resetSession();
  };

  const progressIndicator = form.showProgressIndicator ? (
    <AppointmentProgress title={form.name} currentStep={currentStep} />
  ) : null;

  return (
    <AppointmentConfigContext.Provider value={{supportsMultipleProducts}}>
      <SessionTrackerModal expiryDate={expiryDate}>
        <CreateAppointmentState
          currentStep={currentStep}
          submission={submission}
          resetSession={reset}
        >
          <FormDisplay progressIndicator={progressIndicator}>
            <Wrapper title={form.name}>
              <ErrorBoundary>
                {isLoading ? (
                  <Loader modifiers={['centered']} />
                ) : (
                  <LiteralsProvider literals={form.literals}>
                    <Outlet />
                  </LiteralsProvider>
                )}
              </ErrorBoundary>
            </Wrapper>
          </FormDisplay>
        </CreateAppointmentState>
      </SessionTrackerModal>
    </AppointmentConfigContext.Provider>
  );
};

CreateAppointment.propTypes = {};

const Wrapper = ({children, ...props}) => {
  const isConfirmation = useIsConfirmation();
  if (isConfirmation) return <>{children}</>;

  return (
    <Card titleComponent="h1" modifiers={['mobile-header-hidden']} {...props}>
      {children}
    </Card>
  );
};

export default CreateAppointment;
