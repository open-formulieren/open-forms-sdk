import React from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';

import {Toolbar, ToolbarList} from 'components/Toolbar';
import Button from 'components/Button';

const LogoutButton = ({onLogout}) => {
  return (
    <Toolbar modifiers={['bottom','reverse']}>
      <ToolbarList>
        <Button variant="danger" onClick={onLogout}>
          <FormattedMessage description="Log out button text" defaultMessage="Log out" />
        </Button>
      </ToolbarList>
    </Toolbar>
  )
};

LogoutButton.propTypes = {
  onLogout: PropTypes.func.isRequired,
};


export default LogoutButton;
