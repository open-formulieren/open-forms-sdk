
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

export const twoComponentForm = {
    type: 'form',
    components: [
      {label: 'IBAN', key: 'iban', type: 'iban', validate: {custom: true}},
      {label: 'Name', key: 'name', type: 'textfield'},
    ],
    title: 'testTwoComponentForm',
    display: 'Test 2 Component form',
    name: 'testTwoComponentForm',
    path: 'testTwoComponentForm',
};
