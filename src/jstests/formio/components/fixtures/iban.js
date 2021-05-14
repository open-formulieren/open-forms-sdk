
export const iban = {
    type: 'form',
    components: [
      {label: 'IBAN', key: 'iban', type: 'iban', validate: {custom: true}},
    ],
    	title: 'testIBANForm',
	display: 'Test IBAN form',
	name: 'testIBANForm',
	path: 'testIBANForm',
};
