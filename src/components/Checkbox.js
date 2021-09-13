import React from 'react';

import {getBEMClassName} from '../utils';


const Checkbox = ({label, value, onChange, extraProps}) => {
  return (
    <div className={getBEMClassName('checkbox')}>
      <input
        className={getBEMClassName('checkbox__input')}
        type="checkbox"
        name="privacy"
        id="privacy"
        required={true}
        value={value}
        onChange={onChange}
        {...extraProps}
      />
      <div className={getBEMClassName('checkbox__checkmark')}>
        <label className={getBEMClassName('checkbox__label')} htmlFor="privacy">{label}</label>
      </div>
    </div>
  )
};

export default Checkbox;
