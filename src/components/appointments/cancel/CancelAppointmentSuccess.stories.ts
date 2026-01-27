import type {Meta, StoryObj} from '@storybook/react-vite';

import {withPageWrapper} from '@/sb-decorators';

import CancelAppointmentSuccess from './CancelAppointmentSuccess';

export default {
  title: 'Private API / Appointments / Cancellation / Success',
  component: CancelAppointmentSuccess,
  decorators: [withPageWrapper],
} satisfies Meta<typeof CancelAppointmentSuccess>;

type Story = StoryObj<typeof CancelAppointmentSuccess>;

export const Success: Story = {};
