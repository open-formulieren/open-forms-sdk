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
import {default as NumberComponent} from './components/Number';
import ContentComponent from './components/Content';
import Date from './components/Date';

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
    number: NumberComponent,
    content: ContentComponent,
    date: Date,
  },
};

export default FormIOModule;
