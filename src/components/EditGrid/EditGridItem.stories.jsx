import Body from 'components/Body';
import {OFButton} from 'components/Button';

import {EditGridButtonGroup, EditGridItem as EditGridItemComponent} from './index';

export default {
  title: 'Pure React components / EditGrid / Item',
  component: EditGridItemComponent,
  argTypes: {
    children: {control: false},
    buttons: {control: false},
  },
  args: {
    heading: 'Item heading',
    children: <Body>Item body, typically form fields</Body>,
    buttons: (
      <EditGridButtonGroup>
        <OFButton appearance="primary-action-button">Save</OFButton>
        <OFButton appearance="primary-action-button" hint="danger">
          Remove
        </OFButton>
      </EditGridButtonGroup>
    ),
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

export const Item = {};
