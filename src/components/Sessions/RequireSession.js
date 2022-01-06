import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import Anchor from 'components/Anchor';
import Card from 'components/Card';
import ErrorMessage from 'components/ErrorMessage';

// import SessionExpiry from './SessionExpiry';


const RequireSession = ({ expired=false, children }) => {
  if (!expired) {
    return (
      <>
        {children}
        {/*<SessionExpiry /> disabled for now until we figure out how to style this */}
      </>
    );
  };

  return (
    <Card title={<FormattedMessage description="Session expired card title" defaultMessage="Your session has expired" />}>
      <ErrorMessage>
        <FormattedMessage
          description="Session expired error message"
          defaultMessage="Your session has expired. Click <link>here</link> to restart."
          values={{
            link: chunks => <Link to="/" component={Anchor}>{chunks}</Link>,
          }}
        />
      </ErrorMessage>
    </Card>
  );
};

RequireSession.propTypes = {
  expired: PropTypes.bool,
  children: PropTypes.node,
};


export default RequireSession;
