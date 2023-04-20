import Email from './Email';

export default class CoSignEmail extends Email {
  static schema(...extend) {
    return Email.schema(
      {
        label: 'Co-sign',
        type: 'cosign',
        authPlugin: 'digid', // default
        input: false,
      },
      ...extend
    );
  }
}
