import {expect, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import FormStepSummary from './index';

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
    editUrl: '#',
    name: 'Step title',
    data: [
      {
        name: 'A field',
        value: 'The field value',
        component: {
          type: 'textfield',
          key: 'textfield',
          label: 'A field',
        },
      },
    ],
    editStepText: 'Edit',
  },
  argTypes: {
    name: {type: 'string'},
    editStepText: {type: 'string'},
    slug: {table: {disable: true}},
  },
};

export const Default = {
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

export const NotEditable = {
  args: {
    editStepText: '',
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

export const WithFieldsetAsFirstElement = {
  name: 'Layout components: fieldset, first child',
  args: {
    data: [
      {
        name: 'A fieldset',
        value: '',
        component: {
          type: 'fieldset',
          key: 'fieldset',
          label: 'A fieldset',
        },
      },
      {
        name: 'A textfield',
        value: 'A value',
        component: {
          type: 'textfield',
          key: 'textfield1',
          label: 'A textfield',
        },
      },
      {
        name: 'Another textfield',
        value: 'Another value',
        component: {
          type: 'textfield',
          key: 'textfield2',
          label: 'Another textfield',
        },
      },
    ],
  },
};

export const WithFieldsetNotAsFirstElement = {
  name: 'Layout components: fieldset, not first child',
  args: {
    data: [
      {
        name: 'A number',
        value: 3.14,
        component: {
          type: 'number',
          key: 'number',
          label: 'A number',
        },
      },
      {
        name: 'A fieldset',
        value: '',
        component: {
          type: 'fieldset',
          key: 'fieldset',
          label: 'A fieldset',
        },
      },
      {
        name: 'A textfield',
        value: 'A value',
        component: {
          type: 'textfield',
          key: 'textfield1',
          label: 'A textfield',
        },
      },
      {
        name: 'Another textfield',
        value: 'Another value',
        component: {
          type: 'textfield',
          key: 'textfield2',
          label: 'Another textfield',
        },
      },
    ],
  },
};

export const WithEditGridAsFirstElement = {
  name: 'Layout components: editgrid, first child',
  args: {
    data: [
      {
        name: 'A repeating group',
        value: '',
        component: {
          type: 'editgrid',
          key: 'editgrid',
          label: 'A repeating group',
        },
      },
      {
        name: 'A textfield',
        value: 'A value',
        component: {
          type: 'textfield',
          key: 'textfield1',
          label: 'A textfield',
        },
      },
      {
        name: 'Another textfield',
        value: 'Another value',
        component: {
          type: 'textfield',
          key: 'textfield2',
          label: 'Another textfield',
        },
      },
    ],
  },
};

export const WithEditGridNotAsFirstElement = {
  name: 'Layout components: editgrid, not first child',
  args: {
    data: [
      {
        name: 'A number',
        value: 3.14,
        component: {
          type: 'number',
          key: 'number',
          label: 'A number',
        },
      },
      {
        name: 'A repeating group',
        value: '',
        component: {
          type: 'editgrid',
          key: 'editgrid',
          label: 'A repeating group',
        },
      },
      {
        name: 'A textfield',
        value: 'A value',
        component: {
          type: 'textfield',
          key: 'textfield1',
          label: 'A textfield',
        },
      },
      {
        name: 'Another textfield',
        value: 'Another value',
        component: {
          type: 'textfield',
          key: 'textfield2',
          label: 'Another textfield',
        },
      },
    ],
  },
};

export const WithPartnersAsFirstElement = {
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
          type: 'partners',
          key: 'partners',
          label: 'Partners',
        },
      },
      {
        name: 'A repeating group',
        value: '',
        component: {
          type: 'editgrid',
          key: 'editgrid',
          label: 'A repeating group',
        },
      },
      {
        name: 'A textfield',
        value: 'A value',
        component: {
          type: 'textfield',
          key: 'textfield1',
          label: 'A textfield',
        },
      },
    ],
  },
};
export const WithPartnersAsSecondElement = {
  args: {
    data: [
      {
        name: 'A repeating group',
        value: '',
        component: {
          type: 'editgrid',
          key: 'editgrid',
          label: 'A repeating group',
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
          type: 'partners',
          key: 'partners',
          label: 'Partners',
        },
      },
      {
        name: 'A textfield',
        value: 'A value',
        component: {
          type: 'textfield',
          key: 'textfield1',
          label: 'A textfield',
        },
      },
    ],
  },
};
