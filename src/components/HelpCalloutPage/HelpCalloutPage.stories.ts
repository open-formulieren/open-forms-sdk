import type {Meta, StoryObj} from '@storybook/react-vite';
import {withRouter} from 'storybook-addon-remix-react-router';
import {expect, within} from 'storybook/test';

import {buildForm} from '@/api-mocks';
import {withForm, withNuqs, withSubmission} from '@/sb-decorators';

import HelpCalloutPage from './index';

const DEFAULT_CONTENT = `
  <p><b>Hulp nodig?</b></p>

  <p>Heeft u hulp nodig? Klik op de mooie knop hierboven!</p>

  <p>
    Dit is wat extra tekst voor opvulling met een opsomming:
    <ul>
      <li>Foo</li>
      <li>Bar</li>
    </ul>
  </p>

  <dialog>En een illegaal element</dialog>
`;

export default {
  title: 'Views / HelpCalloutPage',
  component: HelpCalloutPage,
  decorators: [withForm, withNuqs, withRouter],
  parameters: {
    formContext: {
      form: buildForm({
        helpCalloutPage: {
          display: 'before_start_page',
          content: DEFAULT_CONTENT,
          image: './images/helpdesk.png',
        },
      }),
    },
  },
} satisfies Meta<typeof HelpCalloutPage>;

type Story = StoryObj<typeof HelpCalloutPage>;

export const Default: Story = {
  name: 'Before start page',
  play: async ({canvas}) => {
    expect(canvas.getByRole('button', {name: 'Hulp'})).toHaveAttribute('aria-disabled');
  },
};

export const BeforeStartPageWithoutImage: Story = {
  parameters: {
    formContext: {
      form: buildForm({
        helpCalloutPage: {
          display: 'before_start_page',
          content: DEFAULT_CONTENT,
          image: null,
        },
      }),
    },
  },
};

export const AfterStartPage: Story = {
  decorators: [withSubmission],
  parameters: {
    formContext: {
      form: buildForm({
        helpCalloutPage: {
          display: 'after_start_page',
          content: DEFAULT_CONTENT,
          image: null,
        },
      }),
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('link', {name: 'Previous'})).toBeVisible();
  },
};
