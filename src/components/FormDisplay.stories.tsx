import type {Meta, StoryObj} from '@storybook/react-vite';

import Body from '@/components/Body';
import FormContainer from '@/components/FormContainer';
import {withPageWrapper} from '@/sb-decorators';

import FormDisplay from './FormDisplay';

interface Args extends React.ComponentProps<typeof FormDisplay> {
  showProgressIndicator: boolean;
}

export default {
  title: 'Composites / Form display',
  component: FormDisplay,
  decorators: [withPageWrapper],
  render: args => (
    <FormDisplay
      progressIndicator={
        args.showProgressIndicator ? (
          <FormContainer>
            <Body>Progress indicator</Body>
          </FormContainer>
        ) : null
      }
      {...args}
    >
      <FormContainer>
        <Body>Body for relevant route(s)</Body>
      </FormContainer>
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
