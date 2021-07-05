import TextField from "./TextField";


class PostcodeField extends TextField {
  static schema(...extend) {
    return TextField.schema({
        type: 'postcode',
        label: 'Postcode',
        key: 'postcode',
        inputMask: '9999 AA',
        validateOn: 'blur',
        validate: {
          customMessage: 'Invalid Postcode'
        }
    }, ...extend);
  }
}

export default PostcodeField;
