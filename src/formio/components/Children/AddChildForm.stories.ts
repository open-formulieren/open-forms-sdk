import {Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, within} from '@storybook/test';

import {ConfigDecorator} from 'story-utils/decorators';

import AddChildForm from './AddChildForm';

export default {
  title: 'Private API / Children / Modal content',
  component: AddChildForm,
  decorators: [ConfigDecorator],
  args: {
    childValues: null,
    onSave: fn(),
  },
} satisfies Meta<typeof AddChildForm>;

type Story = StoryObj<typeof AddChildForm>;

export const Default: Story = {};

export const HappyFlow: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const bsnInput = await canvas.findByLabelText('BSN');
    const firstNamesInput = await canvas.findByLabelText('Firstnames');

    expect(bsnInput).toBeVisible();
    expect(firstNamesInput).toBeVisible();

    await userEvent.type(bsnInput, '123456782');
    await userEvent.type(firstNamesInput, 'Paul');

    expect(bsnInput).toHaveValue('123456782');
    expect(firstNamesInput).toHaveValue('Paul');

    const dayInput = canvas.getByLabelText('Dag');
    const monthInput = canvas.getByLabelText('Maand');
    const yearInput = canvas.getByLabelText('Jaar');

    expect(dayInput).toBeVisible();
    expect(monthInput).toBeVisible();
    expect(yearInput).toBeVisible();

    await userEvent.type(dayInput, '1');
    await userEvent.type(monthInput, '1');
    await userEvent.type(yearInput, '2000');

    expect(dayInput).toHaveValue('1');
    expect(monthInput).toHaveValue('1');
    expect(yearInput).toHaveValue('2000');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
  },
};

export const RequiredFieldsErrors: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));

    const errors = canvas.getAllByText('Required');
    expect(errors).toHaveLength(3);
  },
};
