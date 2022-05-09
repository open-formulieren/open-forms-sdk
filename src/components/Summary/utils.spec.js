import {getSummaryComponents} from './utils';

test('getSummaryComponents should filter out hidden components', () => {

  const components = [
    {
      "id": "em3xsol",
      "key": "visibleField",
      "type": "textfield",
      "input": true,
      "multiple": false,
      "label": "Visible field",
      "hidden": false,
      "data": {
        "value": undefined,
      }
    },
    {
      "id": "em3xsal",
      "key": "hiddenField",
      "type": "textfield",
      "input": true,
      "multiple": false,
      "hidden": true,
      "label": "Hidden field",
      "data": {
        "value": undefined,
      }
    }
  ];

  const summaryComponents = getSummaryComponents(components);

  expect(summaryComponents.length).toEqual(1);
  expect(summaryComponents[0].key).toEqual('visibleField');

});

describe('getSummaryComponents with nested components', () => {
  it('should not show without children', () => {
    const components = [{
      type: 'fieldset',
      key: 'fieldset',
      components: [],
    }];

    const summaryComponents = getSummaryComponents(components);

    expect(summaryComponents.length).toEqual(0);
  });

  it('should not show with hidden children', () => {
    const components = [{
      type: 'fieldset',
      key: 'fieldset',
      components: [
        {
          "id": "em3xsal",
          "key": "hiddenField",
          "type": "textfield",
          "input": true,
          "multiple": false,
          "hidden": true,
          "label": "Hidden field",
        },
      ],
    }];

    const summaryComponents = getSummaryComponents(components);

    expect(summaryComponents.length).toEqual(0);
  });

  it('should show with visible children', () => {
    const components = [{
      type: 'fieldset',
      key: 'fieldset',
      label: 'A fieldset',
      components: [
        {
          "id": "em3xsal",
          "key": "visibleField",
          "type": "textfield",
          "input": true,
          "multiple": false,
          "hidden": false,
          "label": "Visible field",
        },
      ],
    }];

    const summaryComponents = getSummaryComponents(components);

    expect(summaryComponents.length).toEqual(2);
    expect(summaryComponents[0].label).toEqual('A fieldset');
    expect(summaryComponents[1].label).toEqual('Visible field');
  });

});
