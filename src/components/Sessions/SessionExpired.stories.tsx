import type {Decorator, Meta, StoryObj} from '@storybook/react';
import {useEffect} from 'react';
import {withRouter} from 'storybook-addon-remix-react-router';

import {ConfigDecorator} from 'story-utils/decorators';

import {sessionExpiresAt} from '@/api';
import useSessionTimeout from '@/hooks/useSessionTimeout';

import SessionExpired from './SessionExpired';

const withExpiredSession: Decorator = Story => {
  const [expired] = useSessionTimeout(undefined);
  useEffect(() => {
    const now = new Date();
    sessionExpiresAt.setValue({expiry: now});
    return () => {
      sessionExpiresAt.setValue({expiry: null});
    };
  }, []);

  if (!expired) {
    return <>Waiting for expiry...</>;
  }
  return <Story />;
};

export default {
  title: 'Views / Session Expired',
  component: SessionExpired,
  decorators: [withExpiredSession, ConfigDecorator, withRouter],
  parameters: {
    config: {
      debug: false, // force false in local dev-mode
    },
    reactRouter: {
      routing: '/sessie-verlopen',
    },
  },
} satisfies Meta<typeof SessionExpired>;

type Story = StoryObj<typeof SessionExpired>;

export const Default: Story = {
  name: 'Session Expired',
};
