import type {Meta, StoryObj} from '@storybook/react-vite';
import {withRouter} from 'storybook-addon-remix-react-router';
import {expect, fn, userEvent, waitFor, within} from 'storybook/test';

import {buildForm} from '@/api-mocks';
import {withLiterals} from '@/sb-decorators';

import LoginOptionsDisplay from './LoginOptionsDisplay';
import LoginOptions from './index';

export default {
  title: 'Composites / Login Options',
  component: LoginOptions,
  decorators: [withLiterals, withRouter],
  args: {
    onFormStart: fn(),
  },
  argTypes: {
    form: {table: {disable: true}},
  },
} satisfies Meta<typeof LoginOptions>;

type Story = StoryObj<typeof LoginOptions>;

export const Display: StoryObj<typeof LoginOptionsDisplay> = {
  render: ({loginAsYourselfOptions, loginAsGemachtigdeOptions, cosignLoginOptions}) => (
    <LoginOptionsDisplay
      loginAsYourselfOptions={loginAsYourselfOptions}
      loginAsGemachtigdeOptions={loginAsGemachtigdeOptions}
      cosignLoginOptions={cosignLoginOptions}
    />
  ),
  args: {
    loginAsYourselfOptions: [
      {
        identifier: 'digid',
        label: 'DigiD',
        logo: {
          appearance: 'dark',
          href: 'https://www.digid.nl/',
          title: 'DigiD',
          imageSrc: './digid.png',
        },
        url: '#',
      },
      {
        identifier: 'eHerkenning',
        label: 'eHerkenning',
        logo: {
          appearance: 'light',
          href: 'https://www.eherkenning.nl/',
          title: 'eHerkenning',
          imageSrc: './eherkenning.png',
        },
        url: '#',
      },
      {
        identifier: 'eidas',
        label: 'eIDAS',
        logo: {
          appearance: 'light',
          href: 'https://www.eherkenning.nl/',
          title: 'eIDAS',
          imageSrc: './eidas.png',
        },
        url: '#',
      },
      {
        identifier: 'anonymous',
        label: 'Begin form',
      },
    ],
    loginAsGemachtigdeOptions: [
      {
        identifier: 'digid_machtigen',
        label: 'DigiD Machtigen',
        logo: {
          appearance: 'dark',
          href: 'https://www.digid.nl/',
          title: 'DigiD Machtigen',
          imageSrc: './digid.png',
        },
        url: '#',
      },
    ],
    cosignLoginOptions: [
      {
        identifier: 'digid',
        label: 'DigiD',
        logo: {
          appearance: 'dark',
          href: 'https://www.digid.nl/',
          title: 'DigiD',
          imageSrc: './digid.png',
        },
        url: '#',
      },
      {
        identifier: 'eHerkenning',
        label: 'eHerkenning',
        logo: {
          appearance: 'light',
          href: 'https://www.eherkenning.nl/',
          title: 'eHerkenning',
          imageSrc: './eherkenning.png',
        },
        url: '#',
      },
    ],
  },
};

export const Functional: Story = {
  args: {
    form: buildForm({
      loginRequired: false,
      loginOptions: [
        {
          identifier: 'digid',
          label: 'DigiD',
          url: '#',
          logo: {
            title: 'DigiD simulatie',
            imageSrc: './digid.png',
            href: 'https://www.digid.nl/',
            appearance: 'dark',
          },
          isForGemachtigde: false,
          visible: true,
        },
        {
          identifier: 'eherkenning',
          label: 'eHerkenning',
          url: '#',
          logo: {
            title: 'eHerkenning',
            imageSrc: './eherkenning.png',
            href: 'https://www.eherkenning.nl/',
            appearance: 'light',
          },
          isForGemachtigde: false,
          visible: true,
        },
        {
          identifier: 'eidas',
          label: 'eIDAS',
          url: '#',
          logo: {
            title: 'eIDAS',
            imageSrc: './eidas.png',
            href: 'https://digital-strategy.ec.europa.eu/en/policies/eu-trust-mark',
            appearance: 'light',
          },
          isForGemachtigde: false,
          visible: true,
        },
        {
          identifier: 'digid_machtigen',
          label: 'DigiD Machtigen',
          url: '#',
          logo: {
            title: 'DigiD Machtigen',
            imageSrc: './digid.png',
            href: 'https://www.digid.nl/',
            appearance: 'dark',
          },
          isForGemachtigde: true,
          visible: true,
        },
        {
          identifier: 'eherkenning_bewindvoering',
          label: 'eHerkenning bewindvoering',
          url: '#',
          logo: {
            title: 'eHerkenning bewindvoering',
            imageSrc: './eherkenning.png',
            href: 'https://www.eherkenning.nl/',
            appearance: 'light',
          },
          isForGemachtigde: true,
          visible: true,
        },
      ],
      cosignLoginOptions: [],
    }),
  },
  parameters: {
    literals: {
      beginText: 'Begin form (anonymous)',
    },
  },
  play: async ({args, canvasElement}) => {
    const canvas = within(canvasElement);
    const anonymousStartButton = await canvas.getByRole('button');
    await userEvent.click(anonymousStartButton);
    await waitFor(() => expect(args.onFormStart).toHaveBeenCalled());
  },
};

export const NoMachtigenOptions: Story = {
  name: "No 'machtigen' options",
  args: {
    form: buildForm({
      loginRequired: true,
      loginOptions: [
        {
          identifier: 'digid',
          label: 'DigiD',
          url: '#',
          logo: {
            title: 'DigiD simulatie',
            imageSrc: './digid.png',
            href: 'https://www.digid.nl/',
            appearance: 'dark',
          },
          isForGemachtigde: false,
          visible: true,
        },
      ],
      cosignLoginOptions: [],
    }),
  },
  parameters: {
    literals: {
      beginText: '(anonymous)',
    },
  },
};

export const WithCoSignOption: Story = {
  name: 'Co-sign option',
  args: {
    form: buildForm({
      loginRequired: true,
      loginOptions: [
        {
          identifier: 'digid',
          label: 'DigiD',
          url: '#',
          logo: {
            title: 'DigiD simulatie',
            imageSrc: './digid.png',
            href: 'https://www.digid.nl/',
            appearance: 'dark',
          },
          isForGemachtigde: false,
          visible: true,
        },
      ],
      cosignLoginOptions: [
        {
          identifier: 'digid',
          label: 'DigiD',
          url: 'http://localhost:8000/auth/digid/?next=http://localhost:3000/form?_start=1',
          logo: {
            title: 'DigiD simulatie',
            imageSrc: './digid.png',
            href: 'https://www.digid.nl/',
            appearance: 'dark',
          },
          isForGemachtigde: false,
          visible: true,
        },
      ],
    }),
  },
  parameters: {
    literals: {
      beginText: '(anonymous)',
    },
  },
};

export const VisibleByDefault: Story = {
  name: 'Visible by default',
  args: {
    form: buildForm({
      loginRequired: true,
      loginOptions: [
        {
          identifier: 'digid',
          label: 'DigiD',
          url: '#',
          logo: {
            title: 'DigiD simulatie',
            imageSrc: './digid.png',
            href: 'https://www.digid.nl/',
            appearance: 'dark',
          },
          isForGemachtigde: false,
          visible: true,
        },
        {
          identifier: 'org-oidc',
          label: 'Organization via OpenID Connect',
          url: '#',
          logo: {
            title: 'OpenID Connect',
            imageSrc: './openid.png',
            href: 'https://openid.net/',
            appearance: 'light',
          },
          isForGemachtigde: false,
          visible: false,
        },
      ],
      cosignLoginOptions: [],
    }),
  },
};

export const VisibleWithAuthVisible: Story = {
  name: 'Visible with authVisible=all query param',
  args: {
    form: buildForm({
      loginRequired: true,
      loginOptions: [
        {
          identifier: 'digid',
          label: 'DigiD',
          url: '#',
          logo: {
            title: 'DigiD simulatie',
            imageSrc: './digid.png',
            href: 'https://www.digid.nl/',
            appearance: 'dark',
          },
          isForGemachtigde: false,
          visible: true,
        },
        {
          identifier: 'org-oidc',
          label: 'OpenID Connect',
          url: '#',
          logo: {
            title: 'OpenID Connect',
            imageSrc: './openid.png',
            href: 'https://openid.net/',
            appearance: 'light',
          },
          isForGemachtigde: false,
          visible: false,
        },
      ],
      cosignLoginOptions: [],
    }),
  },
  parameters: {
    config: {
      authAllVisible: true,
    },
  },
};
