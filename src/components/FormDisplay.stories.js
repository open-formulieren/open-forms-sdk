import Body from 'components/Body';
import Card from 'components/Card';
import {LayoutDecorator} from 'story-utils/decorators';

import FormDisplay from './FormDisplay';

export default {
  title: 'Composites / Form display',
  component: FormDisplay,
  decorators: [LayoutDecorator],
  render: args => (
    <FormDisplay
      router={
        <Card>
          <Body>Body for relevant route(s)</Body>
        </Card>
      }
      progressIndicator={
        <Card>
          <Body>Progress indicator</Body>
        </Card>
      }
      {...args}
    />
  ),
  argTypes: {
    router: {table: {disable: true}},
    progressIndicator: {table: {disable: true}},
  },
};

export const Default = {
  args: {
    showProgressIndicator: true,
    isPaymentOverview: false,
  },
};

export const WithoutProgressIndicator = {
  args: {
    showProgressIndicator: false,
    isPaymentOverview: false,
  },
};
