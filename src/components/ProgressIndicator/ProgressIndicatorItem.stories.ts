import type {Meta, StoryObj} from '@storybook/react-vite';
import {withRouter} from 'storybook-addon-remix-react-router';

import ProgressIndicatorItem from './ProgressIndicatorItem';

export default {
  title: 'Private API / ProgressIndicator / ProgressIndicatorItem',
  component: ProgressIndicatorItem,
  decorators: [withRouter],
  args: {
    label: 'Stap 1',
    to: '/dummy',
    isActive: false,
    isCompleted: true,
    canNavigateTo: true,
    isApplicable: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressIndicatorItem>;

type Story = StoryObj<typeof ProgressIndicatorItem>;

export const Default: Story = {};

/**
 * The step is applicable, completed but it is not the currently active step.
 */
export const ApplicableNavigableCompletedNotActive: Story = {
  name: 'Applicable, navigable, completed, not active',
  args: {
    label: 'Stap 1',
    to: '/dummy',
    isActive: false,
    isCompleted: true,
    canNavigateTo: true,
    isApplicable: true,
  },
};

/**
 * The step is applicable, completed and currently active/shown in the main body.
 */
export const ApplicableNavigableCompletedActive: Story = {
  name: 'Applicable, navigable, completed, active',
  args: {
    label: 'Stap 1',
    to: '/dummy',
    isActive: true,
    isCompleted: true,
    canNavigateTo: true,
    isApplicable: true,
  },
};

/**
 * A step that is not completed yet, but is applicable and can be navigated to.
 *
 * E.g. if you are currently on step 2 making changes, and step 3 is unlocked - this
 * can happen when you navigate back from step 3 to step 2.
 */
export const ApplicableNavigableNotCompletedNotActive: Story = {
  name: 'Applicable, navigable, not completed, not active',
  args: {
    label: 'Stap 1',
    to: '/dummy',
    isActive: false,
    isCompleted: false,
    canNavigateTo: true,
    isApplicable: true,
  },
};

/**
 * An active, uncompleted step. The step itself is displayed in the main body.
 *
 * This is the state when you submit step x and it takes you to step x+1.
 */
export const ApplicableNavigableNotCompletedActive: Story = {
  name: 'Applicable, navigable, not completed, active',
  args: {
    label: 'Stap 1',
    to: '/dummy',
    isActive: true,
    isCompleted: false,
    canNavigateTo: true,
    isApplicable: true,
  },
};

/**
 * A step that is relevant but not available yet, e.g. because the previous step needs
 * to be completed first.
 */
export const ApplicableNotNavigable: Story = {
  name: 'Applicable, not navigable',
  args: {
    label: 'Stap 1',
    to: '/dummy',
    isActive: false,
    isCompleted: false,
    canNavigateTo: false,
    isApplicable: true,
  },
};

/**
 * A step that is not relevant (due to logic, for example). It can be a past or future
 * step.
 */
export const NotApplicableNotNavigable: Story = {
  name: 'Not applicable, not navigable',
  args: {
    label: 'Stap 1',
    to: '/dummy',
    isActive: false,
    isCompleted: false,
    canNavigateTo: false,
    isApplicable: false,
  },
};
