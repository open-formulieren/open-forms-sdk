import {Form, Formik, useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import {defineMessage, useIntl} from 'react-intl';
import {Navigate, Outlet, matchPath, resolvePath, useLocation, useNavigate} from 'react-router-dom';
import {useSessionStorage} from 'react-use';

import {ConfigContext} from 'Context';
import Card from 'components/Card';
import ErrorBoundary from 'components/ErrorBoundary';
import FormDisplay from 'components/FormDisplay';
import Loader from 'components/Loader';
import ProgressIndicatorDisplay from 'components/ProgressIndicator/ProgressIndicatorDisplay';
import useGetOrCreateSubmission from 'hooks/useGetOrCreateSubmission';
import Types from 'types';

import ChooseProductStep from './ChooseProductStep';
import ContactDetailsStep from './ContactDetailsStep';
import {AppointmentConfigContext} from './Context';
import LocationAndTimeStep from './LocationAndTimeStep';

const APPOINTMENT_STEPS = [
  {
    path: 'producten',
    element: <ChooseProductStep />,
    name: defineMessage({
      description: "Appointments navbar title for 'products' step",
      defaultMessage: 'Product',
    }),
  },
  {
    path: 'kalender',
    element: <LocationAndTimeStep />,
    name: defineMessage({
      description: "Appointments navbar title for 'location and time' step",
      defaultMessage: 'Location and time',
    }),
  },
  {
    path: 'contactgegevens',
    element: <ContactDetailsStep />,
    name: defineMessage({
      description: "Appointments navbar title for 'contact details' step",
      defaultMessage: 'Contact details',
    }),
  },
];

const APPOINTMENT_STEP_PATHS = APPOINTMENT_STEPS.map(s => s.path);

/**
 * Route subtree for appointment forms.
 */
export const routes = [
  {
    path: '',
    element: <Navigate replace to={APPOINTMENT_STEP_PATHS[0]} />,
  },
  ...APPOINTMENT_STEPS.map(({path, element}) => ({path, element})),
];

/**
 * Check if a given relative path from the routes matches the current location.
 * @param currentPathname The current router location.pathname, from useLocation.
 * @param path            The relative path to check for matches
 */
const checkMatchesPath = (currentPathname, path) => {
  // we need to transform the path into a parent-route lookup, instead of using the
  // default relative ./<foo> behaviour. The idea is that this component is mounted
  // somewhere in a larger route definition but the exact parent route is not relevant.
  const resolvedPath = resolvePath(`../${path}`, currentPathname);
  // if the relative path is not the current URL, matchPath returns null, otherwise
  // a match object.
  const match = matchPath(resolvedPath.pathname, currentPathname);
  return match !== null;
};

const AppointmentProgress = ({title, currentStep}) => {
  const config = useContext(ConfigContext);
  const {
    status: {submittedSteps},
  } = useFormikContext();
  const intl = useIntl();
  const {pathname: currentPathname} = useLocation();

  const [expanded, setExpanded] = useState(false);

  const currentStepIndex = APPOINTMENT_STEP_PATHS.indexOf(currentStep);
  const steps = APPOINTMENT_STEPS.map(({path, name}) => {
    const index = APPOINTMENT_STEP_PATHS.indexOf(path);
    const previousStepIndex = Math.max(index - 1, 0);
    const previousStepCompleted = submittedSteps.includes(
      APPOINTMENT_STEP_PATHS[previousStepIndex]
    );
    return {
      uuid: `appointments-${path}`,
      to: path,
      isCompleted: submittedSteps.includes(path),
      isApplicable: true,
      isCurrent: checkMatchesPath(currentPathname, path),
      canNavigateTo:
        submittedSteps.includes(path) || previousStepCompleted || index === currentStepIndex,
      formDefinition: intl.formatMessage(name),
    };
  });

  const ProgressIndicatorDisplayComponent =
    config?.displayComponents?.progressIndicator ?? ProgressIndicatorDisplay;
  return (
    <ProgressIndicatorDisplayComponent
      activeStepTitle={steps[currentStepIndex].formDefinition}
      formTitle={title}
      steps={steps}
      hasSubmission
      isStartPage={false}
      // TODO
      isSummary={false}
      isConfirmation={false}
      isSubmissionComplete={false}
      areApplicableStepsCompleted={false}
      showOverview
      showConfirmation
      expanded={expanded}
      onExpandClick={() => setExpanded(!expanded)}
    />
  );
};

AppointmentProgress.propTypes = {
  title: PropTypes.string.isRequired,
  currentStep: PropTypes.oneOf(APPOINTMENT_STEP_PATHS).isRequired,
};

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

  const {isLoading, error, submission, removeSubmissionFromStorage} = useGetOrCreateSubmission();
  if (error) throw error;

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
              <Card title={form.name} titleComponent="h1" modifiers={['mobile-header-hidden']}>
                <ErrorBoundary>
                  {isLoading ? <Loader modifiers={['centered']} /> : <Outlet />}
                </ErrorBoundary>
              </Card>
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

export default CreateAppointment;
