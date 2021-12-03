import TextField from './TextField';


export default class LicensePlateField extends TextField {

  static schema(...extend) {
    return TextField.schema({
      type: 'licenseplate',
      label: 'License plate',
      key: 'licenseplate',
      validate: {
        pattern: '^[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}$'
      },
      errors: {
        pattern: 'Invalid Dutch license plate'
      },
      validateOn: 'blur',
    }, ...extend);
  }
}
