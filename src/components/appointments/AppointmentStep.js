import React from 'react';
import {FormattedMessage} from 'react-intl';

import Card from 'components/Card';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import Button from 'components/Button';

import AppointmentFields from './AppointmentFields';

const AppointmentStep = ({onSubmit}) => {
  return (
    <Card
      title={
        <FormattedMessage
          description="Experiment appointment step"
          defaultMessage="Create experiment appointment"
        />
      }
    >
      <AppointmentFields />

      <Toolbar>
        <ToolbarList>
          <Button type="submit" onClick={onSubmit}>
            <FormattedMessage description="Save appointment" defaultMessage="Next" />
          </Button>
        </ToolbarList>
      </Toolbar>
    </Card>
  );
};

export default AppointmentStep;
