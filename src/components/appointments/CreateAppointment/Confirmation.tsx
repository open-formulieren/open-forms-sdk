import {useSearchParams} from 'react-router';

import {ConfirmationView} from '@/components/PostCompletionViews';

import {useCreateAppointmentContext} from './CreateAppointmentState';

const Confirmation: React.FC = () => {
  const [params] = useSearchParams();
  const {reset} = useCreateAppointmentContext();
  const statusUrl = params.get('statusUrl');
  if (!statusUrl) throw new Error('Missing statusUrl param');
  return <ConfirmationView onFailureNavigateTo="../overzicht" onConfirmed={reset} />;
};

export default Confirmation;
