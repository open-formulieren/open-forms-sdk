import {expect} from '@storybook/jest';
import {userEvent, within} from '@storybook/testing-library';

import {withUtrechtDocument} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Tooltips',
  decorators: [withUtrechtDocument],
  args: {
    evalContext: {},
  },
  argTypes: {
    components: {type: {name: 'array', required: true}},
    evalContext: {table: {disable: true}},
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

export const Default = {
  render: SingleFormioComponent,
  args: {
    key: 'cols1',
    type: 'columns',
    label: 'Columns 1',
    extraComponentProperties: {
      columns: [
        {
          size: 2,
          components: [
            {
              key: 'howManyDroidsDidYouDestroy',
              type: 'textfield',
              label: '# droids destroyed?',
              tooltip: 'This tooltip gets the default right placement.',
            },
          ],
        },
        {
          size: 6,
          components: [
            {
              key: 'whatAboutDroidekas',
              type: 'textfield',
              label: "What about Droideka's?",
            },
          ],
        },
        {
          size: 4,
          components: [
            {
              key: 'doYouTrustYourClones',
              type: 'textfield',
              label: 'Do you trust your clones?',
              tooltip:
                "This tooltip should automatically be placed  to the left, because there's no room to the right.",
            },
          ],
        },
      ],
    },
  },
};

export const RightPlacement = {
  render: SingleFormioComponent,
  args: {
    key: 'cols1',
    type: 'columns',
    label: 'Columns 1',
    extraComponentProperties: {
      columns: [
        {
          size: 2,
          components: [
            {
              key: 'howManyDroidsDidYouDestroy',
              type: 'textfield',
              label: '# droids destroyed?',
              tooltip: 'This tooltip gets the default right placement.',
            },
          ],
        },
        {
          size: 6,
          components: [
            {
              key: 'whatAboutDroidekas',
              type: 'textfield',
              label: "What about Droideka's?",
            },
          ],
        },
        {
          size: 4,
          components: [
            {
              key: 'doYouTrustYourClones',
              type: 'textfield',
              label: 'Do you trust your clones?',
              tooltip:
                "This tooltip should automatically be placed  to the left, because there's no room to the right.",
            },
          ],
        },
      ],
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    const left_label = canvas.getByText('# droids destroyed?');
    const left_tooltip_icon = left_label.firstElementChild;

    // tooltip element doesn't exist yet.
    let left_tooltip;

    await step('Hover the left tooltip', async () => {
      userEvent.hover(left_tooltip_icon);
      left_tooltip = await within(left_label).getByRole('tooltip');
      expect(left_tooltip).toBeVisible();
    });

    await step('Stop hovering the left tooltip', async () => {
      await userEvent.unhover(left_tooltip_icon);
      await expect(left_tooltip).not.toBeVisible();
    });
  },
};
