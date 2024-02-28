import '@utrecht/component-library-css/dist/html.css';

import {withUtrechtDocument} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Content',
  decorators: [withUtrechtDocument],
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
    html: `<p>Lorem ipsum <a href="#">dolor</a> sit amet, consectetur adipiscing elit.
    Quisque a felis ante. Nunc dictum, dui et scelerisque euismod, ex dui sodales magna,
    quis vehicula nulla justo sed urna. Integer maximus tempus tellus vel commodo.
    Orci varius natoque penatibus et magnis dis parturient montes.</p>`,
  },
};
