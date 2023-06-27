import {withUtrechtDocument} from 'story-utils/decorators';

import {MultipleFormioComponents, SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Columns',
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
  render: MultipleFormioComponents,
  args: {
    components: [
      {
        key: 'cols1',
        type: 'columns',
        label: 'Columns 1',
        columns: [
          {
            size: 4,
            components: [
              {
                key: 'howManyDroidsDidYouDestroy',
                type: 'textfield',
                label: '# droids destroyed?',
              },
            ],
          },
          {
            size: 4,
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
              },
            ],
          },
        ],
      },
      {
        key: 'isTheForceTrulyWithYou',
        type: 'textfield',
        label: 'Is the force truly with you?',
        description:
          'Harum provident earum quod perferendis dolor tempora. Est ipsum molestiae dolor repellendus id omnis vel.',
      },
    ],
  },
};

export const SizeControl = {
  name: 'Column sizes',
  render: ({col1Size, col2Size, col1MobileSize, col2MobileSize}) => (
    <SingleFormioComponent
      type="columns"
      formioKey="columnsSizes"
      label="olumn sizes"
      extraComponentProperties={{
        columns: [
          {
            size: col1Size,
            sizeMobile: col1MobileSize,
            components: [
              {
                type: 'content',
                html: `Size: ${col1Size}, mobile size: ${col1MobileSize || 'unset'}`,
              },
            ],
          },
          {
            size: col2Size,
            sizeMobile: col2MobileSize,
            components: [
              {
                type: 'content',
                html: `Size: ${col2Size}, mobile size: ${col2MobileSize || 'unset'}`,
              },
            ],
          },
        ],
      }}
    />
  ),
  args: {
    col1Size: 8,
    col2Size: 4,
    col1MobileSize: 0,
    col2MobileSize: 0,
  },
  argTypes: {
    col1Size: {
      name: 'Size column 1',
      type: {required: true},
      control: {type: 'range', min: 1, max: 12, step: 1},
    },
    col2Size: {
      name: 'Size column 2',
      type: {required: true},
      control: {type: 'range', min: 1, max: 12, step: 1},
    },
    col1MobileSize: {
      name: 'Size on mobile column 1',
      control: {type: 'range', min: 0, max: 4, step: 1},
    },
    col2MobileSize: {
      name: 'Size on mobile column 2',
      control: {type: 'range', min: 0, max: 4, step: 1},
    },
    components: {table: {disable: true}},
  },
};

export const Address = {
  render: SingleFormioComponent,
  args: {
    type: 'columns',
    key: 'address',
    label: 'Address columns',
    extraComponentProperties: {
      columns: [
        {
          size: 3,
          sizeMobile: 6,
          components: [
            {
              key: 'postalCode',
              type: 'postcode',
              label: 'Postal code',
            },
          ],
        },
        {
          size: 3,
          sizeMobile: 6,
          components: [
            {
              key: 'number',
              type: 'textfield',
              label: 'House number',
            },
          ],
        },
      ],
    },
  },
  argTypes: {
    components: {table: {disable: true}},
  },
};
