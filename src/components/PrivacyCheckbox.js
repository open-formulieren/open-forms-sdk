import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from '../utils';


const PrivacyCheckbox = ({label, value, onChange}) => {
  return (
    <div className={getBEMClassName('privacy-checkbox')}>
      <input
        type="checkbox"
        name="privacy"
        id="privacy"
        required={true}
        value={value}
        onChange={onChange}
      />
      <div className={getBEMClassName('privacy-checkbox__checkmark')}>
        <label
          className={getBEMClassName('privacy-checkbox__label')}
          htmlFor="privacy"
        >
          <div
            className={getBEMClassName('privacy-checkbox__wyswyg-text')}
            dangerouslySetInnerHTML={{__html: label}}
          />
        </label>
      </div>
    </div>
  )
};

PrivacyCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PrivacyCheckbox;
