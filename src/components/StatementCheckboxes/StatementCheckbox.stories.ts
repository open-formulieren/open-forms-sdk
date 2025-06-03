import type {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within} from '@storybook/test';

import {FormikDecorator} from 'story-utils/decorators';

import StatementCheckbox from './StatementCheckbox';

export default {
  title: 'Pure React components / Statement Checkbox',
  component: StatementCheckbox,
  decorators: [FormikDecorator],
  parameters: {
    formik: {
      initialValues: {},
    },
  },
} satisfies Meta<typeof StatementCheckbox>;

type Story = StoryObj<typeof StatementCheckbox>;

export const Default: Story = {
  args: {
    configuration: {
      key: 'privacyPolicyAccepted',
      type: 'checkbox',
      label: `<p>Ja, ik heb kennis genomen van het <a href="https://maykinmedia.nl/en/privacy/"
        target="_blank" rel="noreferrer noopener">privacybeleid</a> en geef uitdrukkelijk
        toestemming voor het verwerken van de door mij opgegeven gegevens.</p>`,
      validate: {required: true},
    },
    showWarning: false,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  },
};

export const WithWarning: Story = {
  name: 'With warning',
  args: {
    configuration: {
      key: 'privacyPolicyAccepted',
      type: 'checkbox',
      label: `<p>Ja, ik heb kennis genomen van het <a href="https://maykinmedia.nl/en/privacy/"
        target="_blank" rel="noreferrer noopener">privacybeleid</a> en geef uitdrukkelijk
        toestemming voor het verwerken van de door mij opgegeven gegevens.</p>`,
      validate: {required: true},
    },
    showWarning: true,
  },
};
