import Body, {VARIANTS} from './Body';

export default {
  title: 'Pure React components / Body',
  component: Body,
  argTypes: {
    children: {table: {disable: true}},
    component: {control: {disable: true}},
    modifiers: {
      options: VARIANTS,
      control: {
        type: 'check',
      },
    },
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

const render = ({content = 'Body', modifiers = []}) => {
  const isWysiwyg = modifiers.includes('wysiwyg');
  const extra = isWysiwyg
    ? {
        dangerouslySetInnerHTML: {__html: content},
        component: 'div',
      }
    : {};
  return (
    <Body modifiers={modifiers} {...extra}>
      {isWysiwyg ? null : content}
    </Body>
  );
};

export const Default = {
  render,
  args: {
    content: 'Lorem ipsum...',
    modifiers: [],
  },
};

export const WYSIWYG = {
  render,
  args: {
    content:
      '<p>Lorem ipsum with a <a href="https://example.com" target="_blank" rel="noopener nofollower">clickable</a> link...<p>',
    modifiers: ['wysiwyg'],
  },
  argTypes: {
    component: {table: {disable: true}},
  },
};
