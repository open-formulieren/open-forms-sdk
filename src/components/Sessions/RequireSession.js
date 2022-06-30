import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {FormattedMessage, FormattedRelativeTime} from 'react-intl';

import Anchor from 'components/Anchor';
import Card from 'components/Card';
import ErrorMessage from 'components/ErrorMessage';
import Modal from "components/modals/Modal";
import {Toolbar, ToolbarList} from "../Toolbar";
import Button from "../Button";
import {apiCall} from "../../api";
import {ConfigContext} from "../../Context";

const WARN_SESSION_TIMEOUT_FACTOR = 0.9; // once 90% of the session expiry time has passed, show a warning

const RelativeTimeToExpiry = ({numSeconds, raw = false}) => {
  // more than 24 hours -> don't bother
  if (numSeconds >= 3600 * 24) return null;
  const component = (
    <FormattedRelativeTime value={numSeconds} numeric="auto" updateIntervalInSeconds={1} />
  );
  if (raw) return component;
  return <>&nbsp;({component})</>;
};

const untilWarningMilliseconds = (expiryDate) => {
  /*
  Calculate the time until the session expiry warning time should be displayed.
   */
  return (expiryDate - new Date()) * WARN_SESSION_TIMEOUT_FACTOR;
};

const RequireSession = ({expired = false, expiryDate = null, children}) => {
  const {baseUrl} = useContext(ConfigContext);
  const [secondsToExpiry, setSecondsToExpiry] = useState(0);
  const [warningAccepted, setWarningAccepted] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);

  useEffect(() => {
    /*
    Show the warning if the session has expired.
     */
    if (expiryDate) {
      const ms = untilWarningMilliseconds(expiryDate);
      const timeout = setTimeout(() => {
        setWarningVisible(true);
      }, ms);
      return () => clearTimeout(timeout);
    }
  }, [expiryDate]);

  useEffect(() => {
    /*
    Count down to the session expiry time.
     */
    const interval = setInterval(() => {
      setSecondsToExpiry(Math.floor((expiryDate - new Date()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryDate]);

  if (expired) {
    return (
      <Card
        title={<FormattedMessage description="Session expired card title" defaultMessage="Your session has expired"/>}>
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
  }

  const onExtendClick = async () => {
    setWarningAccepted(true);
    await apiCall(`${baseUrl}ping`);
  };

  return (
    <>
      <Modal
        title={
          <FormattedMessage
            description="Session expiry warning title (in modal)"
            defaultMessage="Your session will expire soon."
          />}
        isOpen={warningVisible && !warningAccepted}
        closeModal={() => {
          setWarningAccepted(true);
        }}
      >
        <ErrorMessage modifiers={['warning']}>
          <FormattedMessage
            description="Session expiry warning message (in modal)"
            defaultMessage="Your session is about to expire {delta}. Extend your session if you wish to continue."
            values={{
              delta: <RelativeTimeToExpiry numSeconds={secondsToExpiry} raw />,
            }}/>
        </ErrorMessage>
        <Toolbar modifiers={['bottom', 'reverse']}>
          <ToolbarList>
            <Button type="submit" variant="primary" onClick={onExtendClick}>
              <FormattedMessage description="Extend session button (in modal)" defaultMessage="Extend" />
            </Button>
          </ToolbarList>
        </Toolbar>
      </Modal>
      {children}
    </>
  )
};

RequireSession.propTypes = {
  expired: PropTypes.bool,
  expiryDate: PropTypes.instanceOf(Date),
  children: PropTypes.node,
};


export default RequireSession;
