import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Content',
  args: {
    type: 'content',
    extraComponentProperties: {},
  },
  argTypes: {
    key: {type: {required: true}},
    html: {type: {required: true}},
    label: {type: {required: false}},
    type: {table: {disable: true}},
    extraComponentProperties: {
      description: `Any additional Form.io component properties, recursively merged into the
        component definition.`,
    },
    customClass: {
      options: [null, 'info', 'warning', 'error', 'success'],
      control: {type: 'radio', labels: {[null]: '(none)'}},
    },
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

export const Content = {
  render: ({key: formioKey, html, extraComponentProperties = {}, customClass, ...args}) => (
    <SingleFormioComponent
      formioKey={formioKey}
      {...args}
      extraComponentProperties={{
        ...extraComponentProperties,
        html,
        customClass: customClass ?? '',
      }}
    />
  ),
  args: {
    key: 'content',
    label: '(not rendered)',
    customClass: null,
    html: `<article>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed 
        do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
        sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p><strong>Paragraph</strong>: Lorem ipsum dolor sit amet, <em>consectetur 
        adipiscing elit</em>, sed do eiusmod tempor incididunt ut labore et dolore magna 
        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
        ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint 
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit 
        anim id <a href="https://example.com" target="_blank" rel="external"> 
        est laborum</a>.</p>
        `,
  },
};
