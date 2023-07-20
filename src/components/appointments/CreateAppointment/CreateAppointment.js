import React, {useContext} from 'react';
import {Outlet, useLocation} from 'react-router-dom';

import {ConfigContext} from 'Context';
import Card from 'components/Card';
import ErrorBoundary from 'components/ErrorBoundary';
import FormDisplay from 'components/FormDisplay';
import {LiteralsProvider} from 'components/Literal';
import Loader from 'components/Loader';
import {RequireSession} from 'components/Sessions';
import useFormContext from 'hooks/useFormContext';
import useGetOrCreateSubmission from 'hooks/useGetOrCreateSubmission';
import useSessionTimeout from 'hooks/useSessionTimeout';

import {AppointmentConfigContext} from '../Context';
import AppointmentProgress from './AppointmentProgress';
import CreateAppointmentState from './CreateAppointmentState';
import {APPOINTMENT_STEP_PATHS, checkMatchesPath} from './routes';

const CreateAppointment = () => {
  const form = useFormContext();
  const {isLoading, error, submission, removeSubmissionFromStorage} =
    useGetOrCreateSubmission(form);
  if (error) throw error;

  const [sessionExpired, expiryDate, resetSession] = useSessionTimeout(() => {
    removeSubmissionFromStorage();
    flagNoActiveSubmission();
  });

  const config = useContext(ConfigContext);
  const FormDisplayComponent = config?.displayComponents?.form ?? FormDisplay;
  const supportsMultipleProducts = form?.appointmentOptions.supportsMultipleProducts ?? false;

  const {pathname: currentPathname} = useLocation();
  const currentStep =
    APPOINTMENT_STEP_PATHS.find(step => checkMatchesPath(currentPathname, step)) ||
    APPOINTMENT_STEP_PATHS[0];

  const reset = () => {
    clearSubmission();
    resetSession();
  };

  return (
    <AppointmentConfigContext.Provider value={{supportsMultipleProducts}}>
      <CreateAppointmentState
        currentStep={currentStep}
        submission={submission}
        resetSession={reset}
      >
        <FormDisplayComponent
          router={
            <Wrapper sessionExpired={sessionExpired} title={form.name}>
              <ErrorBoundary>
                {isLoading ? (
                  <Loader modifiers={['centered']} />
                ) : (
                  <RequireSession
                    expired={sessionExpired}
                    expiryDate={expiryDate}
                    onNavigate={reset}
                  >
                    <LiteralsProvider literals={form.literals}>
                      <Outlet />
                    </LiteralsProvider>
                  </RequireSession>
                )}
              </ErrorBoundary>
            </Wrapper>
          }
          progressIndicator={<AppointmentProgress title={form.name} currentStep={currentStep} />}
          showProgressIndicator={form.showProgressIndicator}
          isPaymentOverview={false}
        />
      </CreateAppointmentState>
    </AppointmentConfigContext.Provider>
  );
};

CreateAppointment.propTypes = {};

const Wrapper = ({sessionExpired = false, children, ...props}) => {
  const {pathname} = useLocation();
  const isConfirmation = checkMatchesPath(pathname, 'bevestiging');
  if (sessionExpired || isConfirmation) return <>{children}</>;

  return (
    <Card titleComponent="h1" modifiers={['mobile-header-hidden']} {...props}>
      {children}
    </Card>
  );
};

export default CreateAppointment;
