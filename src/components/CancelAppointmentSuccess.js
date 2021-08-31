import Body from 'components/Body';
import Card from 'components/Card';
import {FormattedMessage} from "react-intl";
import React from "react";

const CancelAppointmentSuccess = () => {

  return (
    <Card title="Afspraak Geannuleerd">
        <Body>
          <FormattedMessage id="appointmentCancelledSuccess" defaultMessage="Uw afspraak is geannuleerd" />
        </Body>
    </Card>
  );
};

export default CancelAppointmentSuccess;
