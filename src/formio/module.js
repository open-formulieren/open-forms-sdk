import Button from './components/Button';
import Component from './components/Component';
import Checkbox from './components/Checkbox';
import Radio from './components/Radio';
import Select from './components/Select';
import TextField from './components/TextField';
import TextArea from './components/TextArea';
import IBANField from './components/IBANField';
import Email from './components/Email';
import Currency from './components/Currency';
import {default as NumberComponent} from './components/Number';
import ContentComponent from './components/Content';
import DateField from './components/DateField';
import TimeField from './components/TimeField';
import PostcodeField from './components/PostcodeField';
import PhoneNumberField from './components/PhoneNumberField';
import BsnField from './components/BsnField';
import FileField from './components/FileField';
import Map from './components/Map';
import PasswordField from './components/Password';
import LicensePlateField from './components/LicensePlateField';
import CoSign from './components/CoSign';
import EditGrid from './components/EditGrid';

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
    date: DateField,
    time: TimeField,
    postcode: PostcodeField,
    phoneNumber: PhoneNumberField,
    bsn: BsnField,
    file: FileField,
    map: Map,
    password: PasswordField,
    licenseplate: LicensePlateField,
    coSign: CoSign,
    editgrid: EditGrid,
  },
};

export default FormIOModule;
