import type {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {buildForm} from '@/api-mocks';
import {
  buildSubmission,
  mockSubmissionGet,
  mockSubmissionSummaryGet,
} from '@/api-mocks/submissions';

import CosignSummary from './CosignSummary';

const submission = buildSubmission();

export default {
  title: 'Views / Cosign / Summary',
  decorators: [withRouter],
  component: CosignSummary,
  args: {
    form: buildForm(),
    submission,
    onSubmissionLoaded: fn(),
    onCosignComplete: fn(),
    onDestroySession: fn(),
  },
  argTypes: {
    form: {table: {disable: true}},
    submission: {table: {disable: true}},
  },
  parameters: {
    msw: {
      handlers: {
        summary: [mockSubmissionGet(submission), mockSubmissionSummaryGet()],
      },
    },
  },
} satisfies Meta<typeof CosignSummary>;

type Story = StoryObj<typeof CosignSummary>;

export const SummaryDataLoaded: Story = {};
