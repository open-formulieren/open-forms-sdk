const currencyForm = {
  type: 'form',
  components: [
    {
      key: 'currency',
      type: 'currency',
      input: true,
      label: 'Currency',
      currency: 'EUR',
      delimiter: true,
      decimalLimit: 0,
    },
  ],
  title: 'Test Currency form',
  display: 'Test Currency form',
  name: 'testCurrencyForm',
  path: 'testCurrencyForm',
};

export {currencyForm};
