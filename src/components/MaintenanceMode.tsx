import {FormattedMessage} from 'react-intl';

import Card from '@/components/Card';
import ErrorMessage from '@/components/Errors/ErrorMessage';
import {IsFormDesigner} from '@/headers';

const MaintenanceModeAlert: React.FC = () => {
  const userIsFormDesigner = IsFormDesigner.getValue();

  let message;
  if (!userIsFormDesigner) {
    message = (
      <FormattedMessage
        description="Maintenance mode message"
        defaultMessage="This form is currently undergoing maintenance and can not be accessed at the moment."
      />
    );
  } else {
    message = (
      <FormattedMessage
        description="Maintenance mode message (for form designer)"
        defaultMessage={`
        This form is currently in maintenance mode. As a staff user, you can
        continue filling out the form as usual.
      `}
      />
    );
  }

  return <ErrorMessage level="info">{message}</ErrorMessage>;
};

export interface MaintenanceModeProps {
  title?: React.ReactNode;
  asToast?: boolean;
}

const MaintenanceMode: React.FC<MaintenanceModeProps> = ({title, asToast = false}) => {
  const alert = <MaintenanceModeAlert />;
  if (asToast) return alert;
  return <Card title={title}>{alert}</Card>;
};

export default MaintenanceMode;
