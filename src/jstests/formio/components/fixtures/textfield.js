const addressPrefillForm = {
  type: 'form',
  components: [
    {
      key: 'postcode',
      type: 'postcode',
      input: true,
      label: 'Postcode',
    },
    {
      key: 'houseNumber',
      type: 'number',
      input: true,
      label: 'House number',
    },
    {
      key: 'streetName',
      type: 'textfield',
      input: true,
      label: 'Street name',
      deriveCity: false,
      derivePostcode: 'postcode',
      isSensitiveData: false,
      deriveStreetName: true,
      deriveHouseNumber: 'houseNumber'
    },
    {
      key: 'city',
      type: 'textfield',
      input: true,
      label: 'City',
      derivePostcode: 'postcode',
      deriveStreetName: false,
      deriveCity: true,
      deriveHouseNumber: 'houseNumber'
    }
  ],
  title: 'Test Prefill Address form',
	display: 'Test Prefill Address form',
	name: 'testPrefillAddressForm',
	path: 'testPrefillAddressForm',
};


export {addressPrefillForm};
