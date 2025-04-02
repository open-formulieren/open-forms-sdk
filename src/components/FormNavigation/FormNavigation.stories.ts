import type {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {AnalyticsToolsDecorator, ConfigDecorator, LiteralDecorator} from 'story-utils/decorators';

import FormNavigation from './index.jsx';

export default {
  title: 'Private API / FormNavigation',
  component: FormNavigation,
  decorators: [ConfigDecorator, withRouter, AnalyticsToolsDecorator, LiteralDecorator],
  args: {
    canSubmitStep: true,
    canSubmitForm: 'yes',
    canSuspendForm: true,
    isLastStep: false,
    isCheckingLogic: false,
    isAuthenticated: true,
    hideAbortButton: false,
    onNavigatePrevPage: fn(),
    onFormSave: fn(),
    previousPage: '#prev',
    onDestroySession: fn(),
  },
} satisfies Meta<typeof FormNavigation>;

type Story = StoryObj<typeof FormNavigation>;

export const Default: Story = {};
