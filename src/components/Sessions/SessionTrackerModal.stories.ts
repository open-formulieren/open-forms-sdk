import type {Meta, StoryObj} from '@storybook/react';
import {addSeconds} from 'date-fns';
import {withRouter} from 'storybook-addon-remix-react-router';

import SessionTrackerModal from './SessionTrackerModal';

export default {
  title: 'Private API / SessionTrackerModal',
  component: SessionTrackerModal,
  decorators: [withRouter],
  args: {
    expiryDate: null,
    children: 'Regular page body.',
  },
  parameters: {
    // the timers cause the content to change
    chromatic: {disableSnapshot: true},
  },
} satisfies Meta<typeof SessionTrackerModal>;

type Story = StoryObj<typeof SessionTrackerModal>;

export const NoExpiryDate: Story = {
  args: {
    expiryDate: null,
  },
};

export const ExpiresSoon: Story = {
  args: {
    expiryDate: addSeconds(new Date(), 1),
  },
};
