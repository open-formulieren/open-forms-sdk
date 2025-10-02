import type {Meta, StoryObj} from '@storybook/react';

import {LayoutDecorator} from 'story-utils/decorators';

import CancelAppointmentSuccess from './CancelAppointmentSuccess';

export default {
  title: 'Private API / Appointments / Cancellation / Success',
  component: CancelAppointmentSuccess,
  decorators: [LayoutDecorator],
} satisfies Meta<typeof CancelAppointmentSuccess>;

type Story = StoryObj<typeof CancelAppointmentSuccess>;

export const Success: Story = {};
