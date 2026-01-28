import type {Meta, StoryObj} from '@storybook/react-vite';

import LoginButtonIcon from './LoginButtonIcon';

export default {
  title: 'Pure React components / Login Button Icon',
  component: LoginButtonIcon,
  args: {
    identifier: 'my-login-option',
  },
} satisfies Meta<typeof LoginButtonIcon>;

type Story = StoryObj<typeof LoginButtonIcon>;

export const Dark: Story = {
  args: {
    logo: {
      appearance: 'dark',
      title: 'Login with DigiD',
      imageSrc: './digid.png',
      href: 'https://example.com/login',
    },
  },
};

export const Light: Story = {
  args: {
    logo: {
      appearance: 'light',
      title: 'Login with eHerkenning',
      imageSrc: './eherkenning.png',
      href: 'https://example.com/login',
    },
  },
};
