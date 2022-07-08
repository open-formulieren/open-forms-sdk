import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';


class EditGrid extends Formio.Components.components.editgrid {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('editgrid');
    return info;
  }
}


export default EditGrid;
