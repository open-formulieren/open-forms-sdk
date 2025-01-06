import {withRouter} from 'storybook-addon-remix-react-router';

import {SummaryProgress} from './index';

export default {
  title: 'Private API / SummaryProgress',
  component: SummaryProgress,
  decorators: [withRouter],
  args: {
    total: 2,
    current: 1,
  },
};

export const Default = {};
