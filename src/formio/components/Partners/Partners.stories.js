import {expect, fn, screen, userEvent, within} from '@storybook/test';

import {ConfigDecorator} from 'story-utils/decorators';

import {SingleFormioComponent} from '../story-util';

export default {
  title: 'Form.io components / Custom / Partners',
  decorators: [ConfigDecorator],
  render: SingleFormioComponent,
  args: {
    type: 'partners',
    key: 'partners',
    label: 'Partners',
  },
};

export const WithDataRetrieved = {
  args: {
    submissionData: {
      partners: [
        {
          bsn: '123456789',
          initials: 'J',
          affixes: 'K',
          lastName: 'Boei',
          dateOfBirth: '2000-01-01',
          __addedManually: false,
        },
        {
          bsn: '165456987',
          initials: '',
          affixes: '',
          lastName: 'Tijest',
          dateOfBirth: '1990-01-01',
          __addedManually: false,
        },
      ],
    },
  },
};

export const NoDataRetrieved = {};

export const ManuallyAddedPartner = {
  args: {
    submissionData: {
      partners: [
        {
          bsn: '123456789',
          initials: 'J',
          affixes: 'K',
          lastName: 'Boei',
          dateOfBirth: '2000-01-01',
          __addedManually: true,
        },
      ],
    },
  },
};

export const EditManuallyAddedPartner = {
  args: {
    onSave: fn(),
    submissionData: {
      partners: [
        {
          bsn: '123456782',
          initials: 'J',
          affixes: 'K',
          lastName: 'Boei',
          dateOfBirth: '2000-01-01',
          __addedManually: true,
        },
      ],
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Check partners details', async () => {
      const bsnLabel = await canvas.findByText(
        (content, element) => element?.tagName.toLowerCase() === 'dt' && content.trim() === 'BSN'
      );
      const bsnValue = bsnLabel.nextElementSibling;
      expect(bsnValue?.textContent).toBe('123456782');

      const initialsLabel = await canvas.findByText(
        (content, element) =>
          element?.tagName.toLowerCase() === 'dt' && content.trim() === 'Initialen'
      );
      const initialsValue = initialsLabel.nextElementSibling;
      expect(initialsValue?.textContent).toBe('J');

      const affixesLabel = await canvas.findByText(
        (content, element) =>
          element?.tagName.toLowerCase() === 'dt' && content.trim() === 'Voorvoegsels'
      );
      const affixesValue = affixesLabel.nextElementSibling;
      expect(affixesValue?.textContent).toBe('K');

      const lastNameLabel = await canvas.findByText(
        (content, element) =>
          element?.tagName.toLowerCase() === 'dt' && content.trim() === 'Achternaam'
      );
      const lastNameValue = lastNameLabel.nextElementSibling;
      expect(lastNameValue?.textContent).toBe('Boei');

      const dateOfBirthLabel = await canvas.findByText(
        (content, element) =>
          element?.tagName.toLowerCase() === 'dt' && content.trim() === 'Geboortedatum'
      );
      const dateOfBirthValue = dateOfBirthLabel.nextElementSibling;
      expect(dateOfBirthValue?.textContent).toBe('2000-01-01');
    });

    await step('Edit the partner', async () => {
      const editButton = await canvas.findByRole('button', {name: 'Partner bewerken'});
      await userEvent.click(editButton);

      const modal = await screen.findByRole('dialog');
      const modalWithin = within(modal);

      const initialsInput = modalWithin.getByLabelText('Initialen');
      await userEvent.type(initialsInput, 'U');

      await user.click(modalWithin.getByRole('button', {name: 'Opslaan'}));
    });

    await step('Check modified partners details', async () => {
      const initialsLabel = canvas.getByText('Initialen');
      const initialsValue = initialsLabel.nextElementSibling;
      expect(initialsValue?.textContent).toBe('JU');
    });
  },
};
