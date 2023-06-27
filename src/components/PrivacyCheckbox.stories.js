import {expect} from '@storybook/jest';
import {userEvent, within} from '@storybook/testing-library';

import PrivacyCheckbox from './PrivacyCheckbox';

export default {
  title: 'Pure React components / Privacy Checkbox',
  component: PrivacyCheckbox,
  argTypes: {
    onChange: {control: 'func'},
    value: {
      control: {disable: true},
    },
  },
};

export const Default = {
  args: {
    label: `<p>Ja, ik heb kennis genomen van het <a href="https://maykinmedia.nl/en/privacy/"
      target="_blank" rel="noreferrer noopener">privacybeleid</a> en geef uitdrukkelijk
      toestemming voor het verwerken van de door mij opgegeven gegevens.</p>`,
    warning: false,
    value: false,
  },
  play: async ({args, canvasElement}) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox'));
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const WithWarning = {
  name: 'With warning',
  args: {
    label: `<p>Ja, ik heb kennis genomen van het <a href="https://maykinmedia.nl/en/privacy/"
      target="_blank" rel="noreferrer noopener">privacybeleid</a> en geef uitdrukkelijk
      toestemming voor het verwerken van de door mij opgegeven gegevens.</p>`,
    warning: true,
    value: false,
  },
};
