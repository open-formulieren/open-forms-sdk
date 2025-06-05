import {expect, userEvent, within} from '@storybook/test';

import {ConfigDecorator} from 'story-utils/decorators';

import AddPartnerForm from './AddPartnerForm';

export default {
  title: 'Private API / Partners / Modal content',
  component: AddPartnerForm,
  decorators: [ConfigDecorator],
  args: {
    componentKey: 'partners',
  },
};

export const Default = {};

export const HappyFlow = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const bsnInput = await canvas.findByLabelText('BSN');
    expect(bsnInput).toBeVisible();
    await userEvent.type(bsnInput, '123456782');
    expect(bsnInput).toHaveValue('123456782');

    const lastNameInput = await canvas.findByLabelText('Lastname');
    expect(lastNameInput).toBeVisible();
    await userEvent.type(lastNameInput, 'Boei');
    expect(lastNameInput).toHaveValue('Boei');

    const dateOfbirthInput = await canvas.findByLabelText('Date of birth');
    expect(dateOfbirthInput).toBeVisible();
    await userEvent.type(dateOfbirthInput, '01-01-2000');
    expect(dateOfbirthInput).toHaveValue('1-1-2000');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
  },
};

export const RequiredFieldsErrors = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));

    const errors = canvas.getAllByText('Required');
    expect(errors).toHaveLength(3);
  },
};
