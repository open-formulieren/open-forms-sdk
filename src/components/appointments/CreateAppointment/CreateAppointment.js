import {Form, Formik} from 'formik';
import React, {useContext} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {useSessionStorage} from 'react-use';

import {ConfigContext} from 'Context';
import Card from 'components/Card';
import ErrorBoundary from 'components/ErrorBoundary';
import FormDisplay from 'components/FormDisplay';
import Loader from 'components/Loader';
import {RequireSession} from 'components/Sessions';
import {flagNoActiveSubmission} from 'data/submissions';
import useGetOrCreateSubmission from 'hooks/useGetOrCreateSubmission';
import useSessionTimeout from 'hooks/useSessionTimeout';
import Types from 'types';

import {AppointmentConfigContext} from '../Context';
import AppointmentProgress from './AppointmentProgress';
import {APPOINTMENT_STEP_PATHS, checkMatchesPath} from './routes';

const CreateAppointment = ({form}) => {
  const config = useContext(ConfigContext);
  const navigate = useNavigate();
  const {pathname: currentPathname} = useLocation();

  const storageKey = `appointmentData|${form.slug}`;
  const [appointmentData, setAppointmentData] = useSessionStorage(storageKey, {
    products: [
      {
        productId: '',
        amount: 1,
      },
    ],
    location: '',
    date: '',
    datetime: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
  });

  const {isLoading, error, removeSubmissionFromStorage} = useGetOrCreateSubmission(form);
  if (error) throw error;

  const [sessionExpired, expiryDate, resetSession] = useSessionTimeout(() => {
    removeSubmissionFromStorage();
    flagNoActiveSubmission();
  });

  const currentStep =
    APPOINTMENT_STEP_PATHS.find(step => checkMatchesPath(currentPathname, step)) ||
    APPOINTMENT_STEP_PATHS[0];

  const supportsMultipleProducts = form?.appointmentOptions.supportsMultipleProducts ?? false;

  const FormDisplayComponent = config?.displayComponents?.form ?? FormDisplay;
  return (
    <AppointmentConfigContext.Provider value={{supportsMultipleProducts}}>
      <Formik
        validateOnChange={false}
        validateOnBlur
        initialValues={appointmentData}
        initialStatus={{submittedSteps: []}}
        onSubmit={(values, {setSubmitting, setStatus}) => {
          setAppointmentData(values);
          switch (currentStep) {
            // last step -> actually submit everything?
            case APPOINTMENT_STEP_PATHS.at(-1): {
              console.log(values);
              // TODO: post to API endpoint, handle validation errors
              window.sessionStorage.clearItem(storageKey);
              removeSubmissionFromStorage();
              resetSession();
              setSubmitting(false);
              break;
            }
            // any step other than the last -> navigate to the next step
            default: {
              const index = APPOINTMENT_STEP_PATHS.indexOf(currentStep);
              const nextStep = APPOINTMENT_STEP_PATHS[index + 1];
              setSubmitting(false);
              setStatus({submittedSteps: APPOINTMENT_STEP_PATHS.filter((_, idx) => idx <= index)});
              navigate(nextStep);
              // TODO: store data in local storage so that hard refreshes don't break the state
              return;
            }
          }
        }}
        // TODO: hook up validationSchema from zod, see #435
      >
        {/* TODO: don't do inline style */}
        <Form style={{width: '100%'}}>
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
                      onNavigate={() => resetSession()}
                    >
                      <Outlet />
                    </RequireSession>
                  )}
                </ErrorBoundary>
              </Wrapper>
            }
            progressIndicator={<AppointmentProgress title={form.name} currentStep={currentStep} />}
            showProgressIndicator={form.showProgressIndicator}
            isPaymentOverview={false}
          />
        </Form>
      </Formik>
    </AppointmentConfigContext.Provider>
  );
};

CreateAppointment.propTypes = {
  form: Types.Form.isRequired,
};

const Wrapper = ({sessionExpired = false, children, ...props}) => {
  if (sessionExpired) return <>{children}</>;

  return (
    <Card titleComponent="h1" modifiers={['mobile-header-hidden']} {...props}>
      {children}
    </Card>
  );
};

export default CreateAppointment;
