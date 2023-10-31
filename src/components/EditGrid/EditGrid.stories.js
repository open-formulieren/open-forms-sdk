import Body from 'components/Body';
import {OFButton} from 'components/Button';

import {EditGrid, EditGridButtonGroup, EditGridItem} from '.';

export default {
  title: 'Pure React components / EditGrid / EditGrid',
  component: EditGrid,
  argTypes: {
    children: {control: false},
    onAddItem: {control: false},
  },
  args: {
    children: (
      <>
        <EditGridItem
          heading="Item 1"
          buttons={
            <EditGridButtonGroup>
              <OFButton appearance="primary-action-button">A button</OFButton>
            </EditGridButtonGroup>
          }
        >
          <Body>First item</Body>
        </EditGridItem>
        <EditGridItem
          heading="Item 2"
          buttons={
            <EditGridButtonGroup>
              <OFButton appearance="primary-action-button">A button</OFButton>
            </EditGridButtonGroup>
          }
        >
          <Body>Second item</Body>
        </EditGridItem>
      </>
    ),
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

export const WithAddButton = {};

export const WithCustomAddButtonLabel = {
  args: {
    addButtonLabel: 'Custom add button label',
  },
};

export const WithoutAddbutton = {
  args: {
    onAddItem: undefined,
  },
};
