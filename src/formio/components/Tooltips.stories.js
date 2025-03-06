import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Tooltips',
  args: {
    evalContext: {},
  },
  argTypes: {
    evalContext: {table: {disable: true}},
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

export const Default = {
  render: SingleFormioComponent,
  args: {
    formioKey: 'cols1',
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
  argTypes: {
    formioKey: {table: {disable: true}},
    label: {table: {disable: true}},
    type: {table: {disable: true}},
  },
};
