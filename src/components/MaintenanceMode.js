import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Body from 'components/Body';
import Card from 'components/Card';
import FAIcon from 'components/FAIcon';
import {IsFormDesigner} from 'headers';
import {getBEMClassName} from 'utils';

const MaintenanceModeAlert = () => {
  const alertClassName = getBEMClassName('alert', ['info']);
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

  return (
    <div className={alertClassName}>
      <span className={getBEMClassName('alert__icon')}>
        <FAIcon icon="info" />
      </span>
      <Body>{message}</Body>
    </div>
  );
};

const MaintenanceMode = ({title, asToast = false}) => {
  const alert = <MaintenanceModeAlert />;
  if (asToast) return alert;
  return <Card title={title}>{alert}</Card>;
};

MaintenanceMode.propTypes = {
  title: PropTypes.node,
  asToast: PropTypes.bool,
};

export default MaintenanceMode;
