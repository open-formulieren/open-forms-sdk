import type {Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, within} from '@storybook/test';

import AddPartnerForm from './AddPartnerForm';

export default {
  title: 'Private API / Partners / Modal content',
  component: AddPartnerForm,
  args: {
    partner: null,
    onSave: fn(),
  },
} satisfies Meta<typeof AddPartnerForm>;

type Story = StoryObj<typeof AddPartnerForm>;

export const Default: Story = {};

export const HappyFlow: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const bsnInput = await canvas.findByLabelText('BSN');
    expect(bsnInput).toBeVisible();
    await userEvent.type(bsnInput, '123456782');
    expect(bsnInput).toHaveValue('123456782');

    const lastNameInput = await canvas.findByLabelText('Achternaam');
    expect(lastNameInput).toBeVisible();
    await userEvent.type(lastNameInput, 'Boei');
    expect(lastNameInput).toHaveValue('Boei');

    const dayInput = canvas.getByLabelText('Dag');
    expect(dayInput).toBeVisible();
    await userEvent.type(dayInput, '1');
    const monthInput = canvas.getByLabelText('Maand');
    expect(monthInput).toBeVisible();
    await userEvent.type(monthInput, '1');
    const yearInput = canvas.getByLabelText('Jaar');
    expect(yearInput).toBeVisible();
    await userEvent.type(yearInput, '2000');

    expect(dayInput).toHaveValue('1');
    expect(monthInput).toHaveValue('1');
    expect(yearInput).toHaveValue('2000');

    await userEvent.click(canvas.getByRole('button', {name: 'Opslaan'}));
  },
};

export const RequiredFieldsErrors: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', {name: 'Opslaan'}));

    expect(await canvas.findByText("Het verplichte veld 'BSN' is niet ingevuld.")).toBeVisible();
    expect(
      await canvas.findByText("Het verplichte veld 'Achternaam' is niet ingevuld.")
    ).toBeVisible();
    expect(
      await canvas.findByText("Het verplichte veld 'Geboortedatum' is niet ingevuld.")
    ).toBeVisible();
  },
};
