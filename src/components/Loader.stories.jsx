import _Loader, {MODIFIERS} from './Loader';

export default {
  title: 'Pure React Components / Loader',
  component: _Loader,
  args: {
    modifiers: [],
  },
  argTypes: {
    modifiers: {
      options: MODIFIERS,
      control: {
        type: 'check',
      },
    },
  },
  parameters: {
    chromatic: {disableSnapshot: true},
  },
};

export const Loader = {};
