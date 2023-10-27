import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import {OFButton} from 'components/Button';
import {Toolbar, ToolbarList} from 'components/Toolbar';

const LogoutButton = ({onLogout}) => {
  return (
    <Toolbar modifiers={['bottom', 'reverse']}>
      <ToolbarList>
        <OFButton appearance="primary-action-button" hint="danger" onClick={onLogout}>
          <FormattedMessage description="Log out button text" defaultMessage="Log out" />
        </OFButton>
      </ToolbarList>
    </Toolbar>
  );
};

LogoutButton.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default LogoutButton;
