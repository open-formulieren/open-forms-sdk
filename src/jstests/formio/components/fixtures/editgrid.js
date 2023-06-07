const editgridForm = {
  type: 'form',
  components: [
    {
      key: 'repeatingGroup',
      type: 'editgrid',
      components: [
        {
          key: 'textField',
          type: 'textfield',
          input: true,
          label: 'TextField',
        },
      ],
    },
  ],
  title: 'Test editgrid form',
  display: 'Test editgrid form',
  name: 'testEditgridForm',
  path: 'testEditgridForm',
};

export {editgridForm};
