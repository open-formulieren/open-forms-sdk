import {useEffect} from 'react';
import {withRouter} from 'storybook-addon-remix-react-router';

import {sessionExpiresAt} from 'api';
import useSessionTimeout from 'hooks/useSessionTimeout';
import {ConfigDecorator} from 'story-utils/decorators';

import SessionExpired from './SessionExpired';

const render = args => {
  const [expired] = useSessionTimeout(null);
  useEffect(() => {
    const now = new Date();
    sessionExpiresAt.setValue({expiry: now});
    return () => {
      sessionExpiresAt.setValue({expiry: null});
    };
  }, []);

  if (!expired) {
    return 'Waiting for expiry...';
  }

  return <SessionExpired {...args} />;
};

export default {
  title: 'Views / Session Expired',
  component: SessionExpired,
  decorators: [ConfigDecorator, withRouter],
  parameters: {
    config: {
      debug: false, // force false in local dev-mode
    },
    reactRouter: {
      routing: '/sessie-verlopen',
    },
  },
};

export const Default = {
  name: 'Session Expired',
  render,
};
