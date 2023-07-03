import BsnField from './components/BsnField';
import Button from './components/Button';
import Checkbox from './components/Checkbox';
import CoSignOld from './components/CoSignOld';
import Component from './components/Component';
import ContentComponent from './components/Content';
import Cosign from './components/Cosign';
import Currency from './components/Currency';
import DateField from './components/DateField';
import DateTimeField from './components/DateTimeField';
import EditGrid from './components/EditGrid';
import Email from './components/Email';
import FileField, {CSRFEnabledUrl} from './components/FileField';
import IBANField from './components/IBANField';
import LicensePlateField from './components/LicensePlateField';
import Map from './components/Map';
import {default as NumberComponent} from './components/Number';
import PasswordField from './components/Password';
import PhoneNumberField from './components/PhoneNumberField';
import PostcodeField from './components/PostcodeField';
import Radio from './components/Radio';
import Select from './components/Select';
import Selectboxes from './components/Selectboxes';
import TextArea from './components/TextArea';
import TextField from './components/TextField';
import TimeField from './components/TimeField';

const FormIOModule = {
  components: {
    button: Button,
    component: Component,
    checkbox: Checkbox,
    radio: Radio,
    selectboxes: Selectboxes,
    select: Select,
    textfield: TextField,
    textarea: TextArea,
    iban: IBANField,
    email: Email,
    currency: Currency,
    number: NumberComponent,
    content: ContentComponent,
    date: DateField,
    datetime: DateTimeField,
    time: TimeField,
    postcode: PostcodeField,
    phoneNumber: PhoneNumberField,
    bsn: BsnField,
    file: FileField,
    map: Map,
    password: PasswordField,
    licenseplate: LicensePlateField,
    coSign: CoSignOld,
    cosign: Cosign,
    editgrid: EditGrid,
  },
  providers: {
    storage: {url: CSRFEnabledUrl},
  },
};

export default FormIOModule;
