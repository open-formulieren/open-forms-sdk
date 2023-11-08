import {withRouter} from 'storybook-addon-react-router-v6';

import ProgressIndicatorItem from './ProgressIndicatorItem';

export default {
  title: 'Private API / ProgressIndicatorNew / ProgressIndicatorItem',
  component: ProgressIndicatorItem,
  decorators: [withRouter],
  args: {
    text: 'Stap 1',
    href: '#',
    isActive: false,
    isCompleted: true,
    canNavigateTo: false,
    isApplicable: true,
    fixedText: null,
  },
};

export const Default = {};
