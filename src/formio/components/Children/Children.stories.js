import {expect, fn, screen, userEvent, within} from '@storybook/test';

import {SingleFormioComponent} from '../story-util';

export default {
  title: 'Form.io components / Custom / Children',
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
          dateOfBirth: '2000-01-01',
          __addedManually: false,
          __id: crypto.randomUUID(),
          selected: null,
        },
        {
          bsn: '165456987',
          firstNames: 'Paul',
          dateOfBirth: '1998-10-16',
          __addedManually: false,
          __id: crypto.randomUUID(),
          selected: null,
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
          dateOfBirth: '2000-01-01',
          __addedManually: false,
          __id: crypto.randomUUID(),
          selected: false,
        },
        {
          bsn: '165456987',
          firstNames: 'Paul',
          dateOfBirth: '1998-10-16',
          __addedManually: false,
          __id: crypto.randomUUID(),
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
          dateOfBirth: '2000-01-01',
          __addedManually: true,
          __id: crypto.randomUUID(),
          selected: null,
        },
        {
          bsn: '165456987',
          firstNames: 'Paul',
          dateOfBirth: '1998-10-16',
          __addedManually: true,
          __id: crypto.randomUUID(),
          selected: null,
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
          dateOfBirth: '2000-01-01',
          __addedManually: true,
          __id: crypto.randomUUID(),
          selected: null,
        },
        {
          bsn: '165456987',
          firstNames: 'Paul',
          dateOfBirth: '1998-10-16',
          __addedManually: true,
          __id: crypto.randomUUID(),
          selected: null,
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
      expect(headerCells[1]).toHaveTextContent('Voornamen');
      expect(headerCells[2]).toHaveTextContent('Geboortedatum');

      const firstChildCells = within(rows[1]).getAllByRole('cell');
      expect(firstChildCells[0]).toHaveTextContent('123456782');
      expect(firstChildCells[1]).toHaveTextContent('Peter');
      expect(firstChildCells[2]).toHaveTextContent('2000-01-01');

      const secondChildCells = within(rows[2]).getAllByRole('cell');
      expect(secondChildCells[0]).toHaveTextContent('165456987');
      expect(secondChildCells[1]).toHaveTextContent('Paul');
      expect(secondChildCells[2]).toHaveTextContent('1998-10-16');

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

      const firstnamesInput = modalWithin.getByLabelText('Voornamen');
      await userEvent.type(firstnamesInput, 'Updated');

      await user.click(modalWithin.getByRole('button', {name: 'Opslaan'}));
    });

    await step('Check modified children details', async () => {
      const table = await canvas.findByRole('table');
      const rows = await within(table).findAllByRole('row');

      // first child updated
      const firstChildCells = within(rows[1]).getAllByRole('cell');
      expect(firstChildCells[0]).toHaveTextContent('123456782');
      expect(firstChildCells[1]).toHaveTextContent('PeterUpdated');
      expect(firstChildCells[2]).toHaveTextContent('2000-01-01');

      // second child not updated
      const secondChildCells = within(rows[2]).getAllByRole('cell');
      expect(secondChildCells[0]).toHaveTextContent('165456987');
      expect(secondChildCells[1]).toHaveTextContent('Paul');
      expect(secondChildCells[2]).toHaveTextContent('1998-10-16');
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

export const DuplicateBsns = {
  args: {
    onSave: fn(),
    onRemoveChild: fn(),
    submissionData: {
      children: [
        {
          bsn: '123456782',
          firstNames: 'Peter',
          dateOfBirth: '2000-01-01',
          __addedManually: true,
          __id: crypto.randomUUID(),
          selected: null,
        },
        {
          bsn: '165456987',
          firstNames: 'Paul',
          dateOfBirth: '1998-10-16',
          __addedManually: true,
          __id: crypto.randomUUID(),
          selected: null,
        },
      ],
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Edit the child', async () => {
      const table = await canvas.findByRole('table');
      const rows = await within(table).findAllByRole('row');
      expect(rows).toHaveLength(3);

      const editIcons = await canvasElement.querySelectorAll('i.fa-pen');
      expect(editIcons).toHaveLength(2);

      await userEvent.click(editIcons[1]);
      const modal = await screen.findByRole('dialog');
      const modalWithin = within(modal);

      const bsnInput = modalWithin.getByLabelText('BSN');
      await user.clear(bsnInput);
      await user.type(bsnInput, '123456782');

      await user.click(modalWithin.getByRole('button', {name: 'Opslaan'}));
    });

    const errorMessage = await canvas.findByText('Multiple children share the same BSN number');
    expect(errorMessage).toBeInTheDocument();
  },
};
