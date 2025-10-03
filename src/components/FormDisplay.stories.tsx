import type {Meta, StoryObj} from '@storybook/react';

import {LayoutDecorator} from 'story-utils/decorators';

import Body from '@/components/Body';
import Card from '@/components/Card';

import FormDisplay from './FormDisplay';

interface Args extends React.ComponentProps<typeof FormDisplay> {
  showProgressIndicator: boolean;
}

export default {
  title: 'Composites / Form display',
  component: FormDisplay,
  decorators: [LayoutDecorator],
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
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    showProgressIndicator: true,
  },
};

export const WithoutProgressIndicator: Story = {
  args: {
    showProgressIndicator: false,
  },
};
