import type {Meta, StoryObj} from '@storybook/react';
import {withRouter} from 'storybook-addon-remix-react-router';

import SummaryProgress from './index';

export default {
  title: 'Private API / SummaryProgress',
  component: SummaryProgress,
  decorators: [withRouter],
  args: {
    total: 2,
    current: 1,
  },
} satisfies Meta<typeof SummaryProgress>;

type Story = StoryObj<typeof SummaryProgress>;

export const Default: Story = {};
