import Body from 'components/Body';
import Card from 'components/Card';
import {ConfigDecorator, LayoutDecorator} from 'story-utils/decorators';

import FormMaximumSubmissions from './FormMaximumSubmissions';

export default {
  title: 'Composites / Form maximum submissions',
  component: FormMaximumSubmissions,
  decorators: [LayoutDecorator, ConfigDecorator],
  render: args => (
    <FormMaximumSubmissions
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
    </FormMaximumSubmissions>
  ),
  argTypes: {
    router: {table: {disable: true}},
    progressIndicator: {table: {disable: true}},
  },
  parameters: {
    config: {debug: false},
  },
};

export const Default = {};

// export const WithoutProgressIndicator = {
//   args: {
//     showProgressIndicator: false,
//   },
// };
