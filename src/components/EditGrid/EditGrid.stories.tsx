import {EditGrid} from '@open-formulieren/formio-renderer';
import {Meta, StoryObj} from '@storybook/react';
import {userEvent, within} from '@storybook/test';

import Body from 'components/Body';

import {FormikDecorator} from '@/story-utils/decorators';

export default {
  title: 'Pure React components / EditGrid / EditGrid',
  decorators: [FormikDecorator],
  component: EditGrid,
  args: {
    name: 'items',
    emptyItem: {},
    addButtonLabel: '',
    getItemHeading: (_, index) => `Item ${index + 1}`,
    getItemBody: (_: unknown, index: number) => {
      switch (index) {
        case 0:
          return <Body>First item</Body>;
        case 1:
          return <Body>Second item</Body>;
        default:
          return <Body>Other</Body>;
      }
    },
    canRemoveItem: () => false,
    enableIsolation: true,
    canEditItem: () => true,
    saveItemLabel: 'A button',
  },
  argTypes: {
    name: {control: false},
  },
  parameters: {
    formik: {
      initialValues: {
        items: [{}, {}],
      },
    },
  },
} satisfies Meta<typeof EditGrid>;

type Story = StoryObj<typeof EditGrid>;

export const WithAddButton: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const buttons = await canvas.findAllByRole('button', {name: /Bewerk item \d/});
    for (const btn of buttons) {
      await userEvent.click(btn);
    }
  },
};

export const WithCustomAddButtonLabel: Story = {
  args: {
    addButtonLabel: 'Custom add button label',
  },
};

export const WithoutAddbutton: Story = {
  args: {
    emptyItem: null,
  },
};
