import Button from './components/Button';
import Component from './components/Component';
import Checkbox from './components/Checkbox';
import Radio from './components/Radio';
import Select from './components/Select';
import TextField from './components/TextField';
import TextArea from './components/TextArea';
import IBANField from "./components/IBANField";
import Email from "./components/Email";

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
    email: Email
  },
};

export default FormIOModule;
