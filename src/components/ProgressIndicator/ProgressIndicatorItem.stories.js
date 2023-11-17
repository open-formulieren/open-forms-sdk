import {withRouter} from 'storybook-addon-react-router-v6';

import ProgressIndicatorItem from './ProgressIndicatorItem';

export default {
  title: 'Private API / ProgressIndicator / ProgressIndicatorItem',
  component: ProgressIndicatorItem,
  decorators: [withRouter],
  args: {
    label: 'Stap 1',
    to: '#',
    isActive: false,
    isCompleted: true,
    canNavigateTo: true,
    isApplicable: true,
  },
};

export const ApplicableLink = {
  name: 'Applicable step - link',
  component: ProgressIndicatorItem,
  args: {
    label: 'Stap 1',
    to: '#',
    isActive: false,
    isCompleted: true,
    canNavigateTo: true,
    isApplicable: true,
  },
};

export const ApplicableNoLink = {
  name: 'Applicable step - no link',
  component: ProgressIndicatorItem,
  args: {
    label: 'Stap 1',
    to: '#',
    isActive: false,
    isCompleted: true,
    canNavigateTo: false,
    isApplicable: true,
  },
};

export const NoApplicableNoLink = {
  name: 'Not applicable step - no link',
  component: ProgressIndicatorItem,
  args: {
    label: 'Stap 1',
    to: '#',
    isActive: false,
    isCompleted: true,
    canNavigateTo: false,
    isApplicable: false,
  },
};

export const Default = {};
