import React from 'react';
import {FormattedMessage} from 'react-intl';

import Body from 'components/Body';
import Button from 'components/Button';
import Card from 'components/Card';
import {Toolbar, ToolbarList} from 'components/Toolbar';

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
      <Body component="form" onSubmit={onSubmit}>
        <AppointmentFields />

        <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
          <ToolbarList>
            <Button type="submit" variant="primary">
              <FormattedMessage description="Save appointment" defaultMessage="Next" />
            </Button>
          </ToolbarList>
        </Toolbar>
      </Body>
    </Card>
  );
};

export default AppointmentStep;
