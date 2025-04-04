import type {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {AnalyticsToolsDecorator, ConfigDecorator, LiteralDecorator} from 'story-utils/decorators';

import FormNavigation, {FormSubmitButton, StepSubmitButton} from './index';

export default {
  title: 'Private API / FormNavigation',
  component: FormNavigation,
  decorators: [ConfigDecorator, withRouter, AnalyticsToolsDecorator, LiteralDecorator],
  args: {
    submitButton: (
      <StepSubmitButton
        canSubmitForm="yes"
        isLastStep={false}
        canSubmitStep
        isCheckingLogic={false}
      />
    ),
    canSuspendForm: true,
    onFormSave: fn(),
    previousPage: '#prev',
    onNavigatePrevPage: fn(),
    isAuthenticated: true,
    hideAbortButton: false,
    onDestroySession: fn(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormNavigation>;

type Story = StoryObj<typeof FormNavigation>;

export const SubmittableStep: Story = {
  args: {
    submitButton: (
      <StepSubmitButton
        canSubmitForm="yes"
        isLastStep={false}
        canSubmitStep
        isCheckingLogic={false}
      />
    ),
  },
};

export const LogicCheckingStep: Story = {
  args: {
    submitButton: (
      <StepSubmitButton canSubmitForm="yes" isLastStep={false} canSubmitStep isCheckingLogic />
    ),
  },
  parameters: {
    chromatic: {disableSnapshot: true},
  },
};

export const LastStepNoOverview: Story = {
  args: {
    submitButton: (
      <StepSubmitButton
        canSubmitForm="no_without_overview"
        isLastStep
        canSubmitStep
        isCheckingLogic={false}
      />
    ),
  },
};

export const SubmittableConfirmation: Story = {
  args: {
    submitButton: <FormSubmitButton canSubmitForm="yes" isDisabled={false} onClick={fn()} />,
    canSuspendForm: false,
  },
};

export const UnsubmittableConfirmation: Story = {
  args: {
    submitButton: <FormSubmitButton canSubmitForm="no_with_overview" isDisabled={false} />,
    canSuspendForm: false,
  },
};
