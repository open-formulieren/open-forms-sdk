import Body from 'components/Body';
import Card from 'components/Card';
import {ConfigDecorator, LayoutDecorator} from 'story-utils/decorators';

import FormDisplay from './FormDisplay';

export default {
  title: 'Composites / Form display',
  component: FormDisplay,
  decorators: [LayoutDecorator, ConfigDecorator],
  render: args => (
    <FormDisplay
      progressIndicator={
        args.showProgressIndicator ? (
          <Card>
            <Body>Progress indicator</Body>
          </Card>
        ) : null
      }
      {...args}
    >
      <Card>
        <Body>Body for relevant route(s)</Body>
      </Card>
    </FormDisplay>
  ),
  argTypes: {
    router: {table: {disable: true}},
    progressIndicator: {table: {disable: true}},
  },
  parameters: {
    config: {debug: false},
  },
};

export const Default = {
  args: {
    showProgressIndicator: true,
  },
};

export const WithoutProgressIndicator = {
  args: {
    showProgressIndicator: false,
  },
};
