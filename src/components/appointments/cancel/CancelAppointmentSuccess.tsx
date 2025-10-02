import {FormattedMessage} from 'react-intl';

import Body from '@/components/Body';
import Card from '@/components/Card';

const CancelAppointmentSuccess: React.FC = () => (
  <Card
    title={
      <FormattedMessage
        description="Appointment cancelled title"
        defaultMessage="Appointment cancelled"
      />
    }
  >
    <Body modifiers={['big']}>
      <FormattedMessage
        description="Appointment cancellated body"
        defaultMessage="Your appointment has been cancelled"
      />
    </Body>
  </Card>
);

export default CancelAppointmentSuccess;
