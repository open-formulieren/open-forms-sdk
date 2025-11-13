import {LoadingIndicator} from '@open-formulieren/formio-renderer';
import {Outlet, useLocation} from 'react-router';

import Card from '@/components/Card';
import ErrorBoundary from '@/components/Errors/ErrorBoundary';
import FormDisplay from '@/components/FormDisplay';
import {LiteralsProvider} from '@/components/Literal';
import {SessionTrackerModal} from '@/components/Sessions';
import useFormContext from '@/hooks/useFormContext';
import useGetOrCreateSubmission from '@/hooks/useGetOrCreateSubmission';
import useSessionTimeout from '@/hooks/useSessionTimeout';
import {checkMatchesPath} from '@/routes/utils';

import {AppointmentConfigContext} from '../Context';
import AppointmentProgress from './AppointmentProgress';
import {CreateAppointmentState} from './CreateAppointmentState';
import {APPOINTMENT_STEP_PATHS} from './steps';

const useIsConfirmation = (): boolean => {
  // useMatch requires absolute paths... and react-router are NOT receptive to changing that.
  const {pathname} = useLocation();
  return checkMatchesPath(pathname, 'bevestiging');
};

const CreateAppointment: React.FC = () => {
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

  const supportsMultipleProducts = form?.appointmentOptions?.supportsMultipleProducts ?? false;

  const currentStep =
    APPOINTMENT_STEP_PATHS.find(relPath => checkMatchesPath(pathname, relPath)) ||
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
                  <LoadingIndicator position="center" />
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

type WrapperProps = React.ComponentProps<typeof Card>;

const Wrapper: React.FC<WrapperProps> = ({children, ...props}) => {
  const isConfirmation = useIsConfirmation();
  if (isConfirmation) return <>{children}</>;
  return (
    <Card mobileHeaderHidden {...props}>
      {children}
    </Card>
  );
};

export default CreateAppointment;
