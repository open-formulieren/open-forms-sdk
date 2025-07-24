import {expect, fn, screen, userEvent, within} from '@storybook/test';

import {ConfigDecorator} from 'story-utils/decorators';

import {SingleFormioComponent} from '../story-util';

export default {
  title: 'Form.io components / Custom / Children',
  decorators: [ConfigDecorator],
  render: SingleFormioComponent,
  args: {
    type: 'children',
    key: 'children',
    label: 'Children',
  },
};

export const WithDataRetrieved = {
  args: {
    submissionData: {
      children: [
        {
          bsn: '123456789',
          firstNames: 'Peter',
          dateOfBirth: '1-1-2000',
          __addedManually: false,
          selected: false,
        },
        {
          bsn: '165456987',
          firstNames: 'Paul',
          dateOfBirth: '16-10-1998',
          __addedManually: false,
          selected: false,
        },
      ],
    },
  },
};

export const WithSelectionEnabled = {
  args: {
    extraComponentProperties: {
      enableSelection: true,
    },
    submissionData: {
      children: [
        {
          bsn: '123456789',
          firstNames: 'Peter',
          dateOfBirth: '1-1-2000',
          __addedManually: false,
          selected: false,
        },
        {
          bsn: '165456987',
          firstNames: 'Paul',
          dateOfBirth: '16-10-1998',
          __addedManually: false,
          selected: false,
        },
      ],
    },
  },
};

export const NoDataRetrieved = {};

export const ManuallyAddedChildren = {
  args: {
    submissionData: {
      children: [
        {
          bsn: '123456789',
          firstNames: 'Peter',
          dateOfBirth: '1-1-2000',
          __addedManually: true,
          selected: false,
        },
        {
          bsn: '165456987',
          firstNames: 'Paul',
          dateOfBirth: '16-10-1998',
          __addedManually: true,
          selected: false,
        },
      ],
    },
  },
};

export const EditManuallyAddedChildren = {
  args: {
    onSave: fn(),
    onRemoveChild: fn(),
    submissionData: {
      children: [
        {
          bsn: '123456782',
          firstNames: 'Peter',
          dateOfBirth: '1-1-2000',
          __addedManually: true,
          selected: false,
        },
        {
          bsn: '165456987',
          firstNames: 'Paul',
          dateOfBirth: '16-10-1998',
          __addedManually: true,
          selected: false,
        },
      ],
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Check children details', async () => {
      const table = await canvas.findByRole('table');
      const rows = await within(table).findAllByRole('row');
      expect(rows).toHaveLength(3);

      const headerCells = within(rows[0]).getAllByRole('columnheader');
      expect(headerCells[0]).toHaveTextContent('BSN');
      expect(headerCells[1]).toHaveTextContent('Firstnames');
      expect(headerCells[2]).toHaveTextContent('Date of birth');

      const firstChildCells = within(rows[1]).getAllByRole('cell');
      expect(firstChildCells[0]).toHaveTextContent('123456782');
      expect(firstChildCells[1]).toHaveTextContent('Peter');
      expect(firstChildCells[2]).toHaveTextContent('1-1-2000');

      const secondChildCells = within(rows[2]).getAllByRole('cell');
      expect(secondChildCells[0]).toHaveTextContent('165456987');
      expect(secondChildCells[1]).toHaveTextContent('Paul');
      expect(secondChildCells[2]).toHaveTextContent('16-10-1998');

      const editIcons = canvasElement.querySelectorAll('i.fa-pen');
      const deleteIcons = canvasElement.querySelectorAll('i.fa-trash-can');
      expect(editIcons).toHaveLength(2);
      expect(deleteIcons).toHaveLength(2);
    });

    await step('Edit the first child', async () => {
      const editIcons = canvasElement.querySelectorAll('i.fa-pen');
      await userEvent.click(editIcons[0]);

      const modal = await screen.findByRole('dialog');
      const modalWithin = within(modal);

      const firstnamesInput = modalWithin.getByLabelText('Firstnames');
      await userEvent.type(firstnamesInput, 'Updated');

      await user.click(modalWithin.getByRole('button', {name: 'Save'}));
    });

    await step('Check modified children details', async () => {
      const table = await canvas.findByRole('table');
      const rows = await within(table).findAllByRole('row');

      // first child updated
      const firstChildCells = within(rows[1]).getAllByRole('cell');
      expect(firstChildCells[0]).toHaveTextContent('123456782');
      expect(firstChildCells[1]).toHaveTextContent('PeterUpdated');
      expect(firstChildCells[2]).toHaveTextContent('1-1-2000');

      // second child not updated
      const secondChildCells = within(rows[2]).getAllByRole('cell');
      expect(secondChildCells[0]).toHaveTextContent('165456987');
      expect(secondChildCells[1]).toHaveTextContent('Paul');
      expect(secondChildCells[2]).toHaveTextContent('16-10-1998');
    });

    await step('Remove the second child', async () => {
      window.confirm = () => true;

      const deleteIcons = canvasElement.querySelectorAll('i.fa-trash-can');
      await userEvent.click(deleteIcons[0]);

      const table = canvas.getByRole('table');
      const rows = await within(table).findAllByRole('row');

      expect(rows).toHaveLength(2);
    });
  },
};
