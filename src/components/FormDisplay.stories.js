import Body from 'components/Body';
import Card from 'components/Card';
import {LayoutDecorator} from 'story-utils/decorators';

import FormDisplay from './FormDisplay';

export default {
  title: 'Composites / Form display',
  component: FormDisplay,
  argTypes: {
    // showProgressIndicator: {control: 'boolean'},
    // isPaymentOverview: {control: 'boolean'},
    // router: {table: {disable: true}},
    // progressIndicator: {table: {disable: true}},
  },
  decorators: [LayoutDecorator],
};

export const Default = {
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
  args: {
    showProgressIndicator: true,
    isPaymentOverview: false,
  },
  argTypes: {
    // showProgressIndicator: {control: 'boolean'},
    // isPaymentOverview: {control: 'boolean'},
    router: {table: {disable: true}},
    progressIndicator: {table: {disable: true}},
  },
};
