import Body from './Body';
import Card from './Card';

export default {
  title: 'Pure React components / Card',
  component: Card,
  argTypes: {
    children: {control: false},
    captionComponent: {control: false},
    titleComponent: {control: false},
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

export const Default = {
  args: {
    title: 'The Rig',
    caption: '',
    modifiers: [],
    blockClassName: '',
    children: <Body>By Blanck Mass</Body>,
  },
};
