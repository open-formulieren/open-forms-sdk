import Button from './components/Button';
import Component from './components/Component';
import Checkbox from './components/Checkbox';
import Radio from './components/Radio';
import Select from './components/Select';
import TextField from './components/TextField';
import TextArea from './components/TextArea';
import IBANField from "./components/IBANField";
import Email from "./components/Email";
import Currency from './components/Currency';
import Number from './components/Number';
import FieldSet from './components/FieldSet';
import Content from './components/Content';

const FormIOModule = {
  components: {
    button: Button,
    component: Component,
    checkbox: Checkbox,
    radio: Radio,
    select: Select,
    textfield: TextField,
    textarea: TextArea,
    iban: IBANField,
    email: Email,
    currency: Currency,
    number: Number,
    fieldset: FieldSet,
    content: Content,
  },
};

export default FormIOModule;
