import {Formio} from 'react-formio';

import {applyPrefix} from '../utils';


class FileField extends Formio.Components.components.file {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('file');
    return info;
  }
}


export default FileField;
