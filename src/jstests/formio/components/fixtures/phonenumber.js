const phoneNumberComponent = {
  label: 'Phone Number',
  key: 'phonenumber',
  type: 'phoneNumber',
  input: true,
  validate: {
    backendApi: true,
    plugins: ['phonenumber-international', 'phonenumber-nl'],
  },
};

const validSamples = ['0630123456', '+31630123456'];
const inValidSamples = ['63012345', '+3163012345'];

export {phoneNumberComponent, validSamples, inValidSamples};
