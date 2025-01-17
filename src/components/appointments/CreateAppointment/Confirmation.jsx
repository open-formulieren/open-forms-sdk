import {useSearchParams} from 'react-router-dom';

import {ConfirmationView} from 'components/PostCompletionViews';

import {useCreateAppointmentContext} from './CreateAppointmentState';

const Confirmation = () => {
  const [params] = useSearchParams();
  const {reset, setProcessingError} = useCreateAppointmentContext();
  const statusUrl = params.get('statusUrl');
  if (!statusUrl) throw new Error('Missing statusUrl param');
  return (
    <ConfirmationView returnTo="../overzicht" onFailure={setProcessingError} onConfirmed={reset} />
  );
};

Confirmation.propTypes = {};

export default Confirmation;
