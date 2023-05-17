import TextField from '../TextField/TextField';

const EmailField = props => <TextField {...props} type="email" />;

const {type, ...emailPropTypes} = TextField.propTypes;
EmailField.propTypes = emailPropTypes;

export default EmailField;
