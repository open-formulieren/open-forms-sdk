import React from 'react';
import {FormattedMessage} from 'react-intl';

import {CardTitle} from 'components/Card';

import DateSelect from './DateSelect';
import LocationSelect from './LocationSelect';
import TimeSelect from './TimeSelect';

// FIXME: check the wizard state - if the user messed with the URLs -> navigate back to
// required preceding step

const LocationAndTimeStep = () => {
  return (
    <>
      <CardTitle
        title={
          <FormattedMessage
            description="Appointments: select location and time step title"
            defaultMessage="Location and time"
          />
        }
        component="h2"
        headingType="subtitle"
        modifiers={['padded']}
      />
      <div>
        <LocationSelect />
        <DateSelect />
        <TimeSelect />
      </div>
    </>
  );
};

LocationAndTimeStep.propTypes = {};

export default LocationAndTimeStep;
