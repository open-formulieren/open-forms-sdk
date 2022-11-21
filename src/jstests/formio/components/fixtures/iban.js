export const iban = {
  type: 'form',
  components: [{label: 'IBAN', key: 'iban', type: 'iban'}],
  title: 'testIBANForm',
  display: 'Test IBAN form',
  name: 'testIBANForm',
  path: 'testIBANForm',
};

export const twoComponentForm = {
  type: 'form',
  components: [
    {label: 'IBAN', key: 'iban', type: 'iban'},
    {label: 'Name', key: 'name', type: 'textfield'},
  ],
  title: 'testTwoComponentForm',
  display: 'Test 2 Component form',
  name: 'testTwoComponentForm',
  path: 'testTwoComponentForm',
};
