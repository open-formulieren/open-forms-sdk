import _Loader, {MODIFIERS} from './Loader';

export default {
  title: 'Pure React Components / Loader',
  component: _Loader,
  args: {
    modifiers: [],
    withoutTranslation: true,
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
