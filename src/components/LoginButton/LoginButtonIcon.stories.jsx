import LoginButtonIcon, {LOGO_APPEARANCES} from './LoginButtonIcon';

export default {
  title: 'Pure React components / Login Button Icon',
  component: LoginButtonIcon,
  argTypes: {
    logo: {control: {disable: true}},
    identifier: {control: {disable: true}},
    appearance: {
      options: LOGO_APPEARANCES,
      control: {
        type: 'radio',
      },
    },
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

const render = ({
  appearance,
  identifier = '6f64d852-f927-48b8-9b72-dae7fa9d4c18',
  imageSrc,
  href,
  title,
}) => <LoginButtonIcon identifier={identifier} logo={{appearance, title, imageSrc, href}} />;

export const Dark = {
  render,
  args: {
    appearance: 'dark',
    title: 'Login with DigiD',
    imageSrc: './digid.png',
    href: 'https://example.com/login',
  },
};

export const Light = {
  render,
  args: {
    appearance: 'light',
    title: 'Login with eHerkenning',
    imageSrc: './eherkenning.png',
    href: 'https://example.com/login',
  },
};
