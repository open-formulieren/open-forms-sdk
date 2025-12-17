import type {CustomerProfileComponentSchema} from '@open-formulieren/types';
import type {Meta, StoryObj} from '@storybook/react';
import {expect, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import FormStepSummary from './FormStepSummary';

export default {
  title: 'Private API / FormStepSummary',
  component: FormStepSummary,
  decorators: [withRouter],
  parameters: {
    reactRouter: {
      routing: '/overzicht',
    },
  },
  args: {
    name: 'Step title',
    data: [
      {
        name: 'A field',
        value: 'The field value',
        component: {
          id: 'textfield',
          type: 'textfield',
          key: 'textfield',
          label: 'A field',
        },
      },
    ],
    editUrl: '#',
    editStepText: 'Edit',
  },
  argTypes: {
    name: {type: 'string'},
    editStepText: {type: 'string'},
  },
} satisfies Meta<typeof FormStepSummary>;

type Story = StoryObj<typeof FormStepSummary>;

export const Default: Story = {
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Accessible heading for step title', () => {
      const stepTitle = canvas.getByRole('heading', {level: 2, name: 'Step title'});
      expect(stepTitle).toBeVisible();
    });

    await step('Clickable link to edit step data', () => {
      expect(canvas.getByRole('link', {name: 'Edit'})).toBeVisible();
    });
  },
};

export const NotEditable: Story = {
  args: {
    blockEdit: true,
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Accessible heading for step title', () => {
      const stepTitle = canvas.getByRole('heading', {level: 2, name: 'Step title'});
      expect(stepTitle).toBeVisible();
    });

    await step('No link to edit step data', () => {
      expect(canvas.queryByRole('link')).not.toBeInTheDocument();
    });
  },
};

export const WithFieldsetAsFirstElement: Story = {
  name: 'Layout components: fieldset, first child',
  args: {
    data: [
      {
        name: 'A fieldset',
        value: '',
        component: {
          id: 'component1',
          type: 'fieldset',
          key: 'fieldset',
          label: 'A fieldset',
          hideHeader: false,
          components: [
            {
              id: 'component2',
              type: 'textfield',
              key: 'textfield1',
              label: 'A textfield',
            },
          ],
        },
      },
      {
        name: 'A textfield',
        value: 'A value',
        component: {
          id: 'component3',
          type: 'textfield',
          key: 'textfield1',
          label: 'A textfield',
        },
      },
      {
        name: 'Another textfield',
        value: 'Another value',
        component: {
          id: 'component4',
          type: 'textfield',
          key: 'textfield2',
          label: 'Another textfield',
        },
      },
    ],
  },
};

export const WithFieldsetNotAsFirstElement: Story = {
  name: 'Layout components: fieldset, not first child',
  args: {
    data: [
      {
        name: 'A number',
        value: 3.14,
        component: {
          id: 'component1',
          type: 'number',
          key: 'number',
          label: 'A number',
        },
      },
      {
        name: 'A fieldset',
        value: '',
        component: {
          id: 'component2',
          type: 'fieldset',
          key: 'fieldset',
          label: 'A fieldset',
          hideHeader: false,
          components: [
            {
              id: 'component3',
              type: 'textfield',
              key: 'textfield1',
              label: 'A textfield',
            },
            {
              id: 'component4',
              type: 'textfield',
              key: 'textfield2',
              label: 'Another textfield',
            },
          ],
        },
      },
      {
        name: 'A textfield',
        value: 'A value',
        component: {
          id: 'component5',
          type: 'textfield',
          key: 'textfield1',
          label: 'A textfield',
        },
      },
      {
        name: 'Another textfield',
        value: 'Another value',
        component: {
          id: 'component6',
          type: 'textfield',
          key: 'textfield2',
          label: 'Another textfield',
        },
      },
    ],
  },
};

export const WithEditGridAsFirstElement: Story = {
  name: 'Layout components: editgrid, first child',
  args: {
    data: [
      {
        name: 'A repeating group',
        value: '',
        component: {
          id: 'component1',
          type: 'editgrid',
          key: 'editgrid',
          label: 'A repeating group',
          groupLabel: 'Item',
          disableAddingRemovingRows: false,
          components: [
            {
              id: 'component2',
              type: 'textfield',
              key: 'textfield1',
              label: 'A textfield',
            },
            {
              id: 'component3',
              type: 'textfield',
              key: 'textfield2',
              label: 'Another textfield',
            },
          ],
        },
      },
      {
        name: 'A textfield',
        value: 'A value',
        component: {
          id: 'component4',
          type: 'textfield',
          key: 'textfield1',
          label: 'A textfield',
        },
      },
      {
        name: 'Another textfield',
        value: 'Another value',
        component: {
          id: 'component5',
          type: 'textfield',
          key: 'textfield2',
          label: 'Another textfield',
        },
      },
    ],
  },
};

export const WithEditGridNotAsFirstElement: Story = {
  name: 'Layout components: editgrid, not first child',
  args: {
    data: [
      {
        name: 'A number',
        value: 3.14,
        component: {
          id: 'component1',
          type: 'number',
          key: 'number',
          label: 'A number',
        },
      },
      {
        name: 'A repeating group',
        value: '',
        component: {
          id: 'component2',
          type: 'editgrid',
          key: 'editgrid',
          label: 'A repeating group',
          groupLabel: 'Item',
          disableAddingRemovingRows: false,
          components: [
            {
              id: 'component3',
              type: 'textfield',
              key: 'textfield1',
              label: 'A textfield',
            },
            {
              id: 'component4',
              type: 'textfield',
              key: 'textfield2',
              label: 'Another textfield',
            },
          ],
        },
      },
      {
        name: 'A textfield',
        value: 'A value',
        component: {
          id: 'component5',
          type: 'textfield',
          key: 'textfield1',
          label: 'A textfield',
        },
      },
      {
        name: 'Another textfield',
        value: 'Another value',
        component: {
          id: 'component6',
          type: 'textfield',
          key: 'textfield2',
          label: 'Another textfield',
        },
      },
    ],
  },
};

export const WithPartnersAsFirstElement: Story = {
  args: {
    data: [
      {
        name: 'Partners',
        value: [
          {
            bsn: '999970136',
            affixes: '',
            initials: 'P.',
            lastName: 'Pauw',
            firstNames: 'Pia',
            dateOfBirth: '1989-04-01',
            dateOfBirthPrecision: 'date',
          },
        ],
        component: {
          id: 'component1',
          type: 'partners',
          key: 'partners',
          label: 'Partners',
        },
      },
      {
        name: 'Partner 1',
        value: '',
        component: {
          id: 'component1',
          type: 'partners',
          key: 'partners',
          label: 'Partners',
        },
      },
      {
        name: 'BSN',
        value: 'XXXXXXXXX',
        component: {
          id: 'bsn',
          type: 'bsn',
          key: 'bsn',
          label: 'BSN',
          inputMask: '999999999',
          validateOn: 'blur',
        },
      },
      {
        name: 'A repeating group',
        value: '',
        component: {
          id: 'component2',
          type: 'editgrid',
          key: 'editgrid',
          label: 'A repeating group',
          groupLabel: 'Item',
          disableAddingRemovingRows: false,
          components: [
            {
              id: 'component3',
              type: 'textfield',
              key: 'textfield1',
              label: 'A textfield',
            },
          ],
        },
      },
      {
        name: 'A textfield',
        value: 'A value',
        component: {
          id: 'component4',
          type: 'textfield',
          key: 'textfield1',
          label: 'A textfield',
        },
      },
    ],
  },
};
export const WithPartnersAsSecondElement: Story = {
  args: {
    data: [
      {
        name: 'A repeating group',
        value: '',
        component: {
          id: 'component1',
          type: 'editgrid',
          key: 'editgrid',
          label: 'A repeating group',
          groupLabel: 'Item',
          disableAddingRemovingRows: false,
          components: [],
        },
      },
      {
        name: 'A textfield',
        value: 'A value',
        component: {
          id: 'component3',
          type: 'textfield',
          key: 'textfield1',
          label: 'A textfield',
        },
      },
      {
        name: 'Partners',
        value: [
          {
            bsn: '999970136',
            affixes: '',
            initials: 'P.',
            lastName: 'Pauw',
            firstNames: 'Pia',
            dateOfBirth: '1989-04-01',
            dateOfBirthPrecision: 'date',
          },
        ],
        component: {
          id: 'component2',
          type: 'partners',
          key: 'partners',
          label: 'Partners',
        },
      },
      {
        name: 'Partner 1',
        value: '',
        component: {
          id: 'component1',
          type: 'partners',
          key: 'partners',
          label: 'Partners',
        },
      },
      {
        name: 'BSN',
        value: 'XXXXXXXXX',
        component: {
          id: 'bsn',
          type: 'bsn',
          key: 'bsn',
          label: 'BSN',
          inputMask: '999999999',
          validateOn: 'blur',
        },
      },
    ],
  },
};

export const WithCustomerProfileAsFirstElement: Story = {
  args: {
    data: [
      {
        name: 'Profile',
        value: [
          {
            type: 'email',
            address: 'test@mail.com',
            preferenceUpdate: 'useOnlyOnce',
          },
          {
            type: 'phoneNumber',
            address: '06 12345678',
            preferenceUpdate: 'isNewPreferred',
          },
        ],
        component: {
          id: 'component1',
          type: 'customerProfile',
          key: 'profile',
          label: 'Profile',
          shouldUpdateCustomerData: true,
          digitalAddressTypes: ['email', 'phoneNumber'],
        } satisfies CustomerProfileComponentSchema,
      },
      {
        name: 'BSN',
        value: 'XXXXXXXXX',
        component: {
          id: 'bsn',
          type: 'bsn',
          key: 'bsn',
          label: 'BSN',
          inputMask: '999999999',
          validateOn: 'blur',
        },
      },
      {
        name: 'A repeating group',
        value: '',
        component: {
          id: 'component2',
          type: 'editgrid',
          key: 'editgrid',
          label: 'A repeating group',
          groupLabel: 'Item',
          disableAddingRemovingRows: false,
          components: [
            {
              id: 'component3',
              type: 'textfield',
              key: 'textfield1',
              label: 'A textfield',
            },
          ],
        },
      },
      {
        name: 'A textfield',
        value: 'A value',
        component: {
          id: 'component4',
          type: 'textfield',
          key: 'textfield1',
          label: 'A textfield',
        },
      },
    ],
  },
};
