import {expect, fn, userEvent, waitFor, within} from '@storybook/test';

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
          dateOfBirth: '1-1-2000',
          __addedManually: false,
        },
        {
          bsn: '165456987',
          initials: '',
          affixes: '',
          lastName: 'Tijest',
          dateOfBirth: '1-1-1990',
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
          dateOfBirth: '1-1-2000',
          __addedManually: true,
        },
      ],
    },
  },
};

export const EditManuallyAddedPartner = {
  args: {
    submissionData: {
      partners: [
        {
          bsn: '123456789',
          initials: 'J',
          affixes: 'K',
          lastName: 'Boei',
          dateOfBirth: '1-1-2000',
          __addedManually: true,
        },
      ],
    },
    ofContext: {
      addPartnerCallback: fn(),
    },
  },
  play: async ({canvasElement, args, step}) => {
    const canvas = within(canvasElement);

    const bsnLabel = canvas.getByText('BSN');
    const bsnValue = bsnLabel.nextElementSibling;
    expect(bsnValue?.textContent).toBe('123456789');

    const initialsLabel = canvas.getByText('Initials');
    const initialsValue = initialsLabel.nextElementSibling;
    expect(initialsValue?.textContent).toBe('J');

    const affixesLabel = canvas.getByText('Affixes');
    const affixesValue = affixesLabel.nextElementSibling;
    expect(affixesValue?.textContent).toBe('K');

    const lastNameLabel = canvas.getByText('Lastname');
    const lastNameValue = lastNameLabel.nextElementSibling;
    expect(lastNameValue?.textContent).toBe('Boei');

    const dateOfBirthLabel = canvas.getByText('Date of birth');
    const dateOfBirthValue = dateOfBirthLabel.nextElementSibling;
    expect(dateOfBirthValue?.textContent).toBe('1-1-2000');

    await step('Click edit button and verify callback', async () => {
      const editButton = await canvas.findByRole('button', {name: 'Edit partner'});
      await userEvent.click(editButton);
      await waitFor(() => expect(args.ofContext.addPartnerCallback).toHaveBeenCalledOnce());
    });
  },
};
