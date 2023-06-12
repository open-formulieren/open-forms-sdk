import classNames from 'classnames';
import React from 'react';

// TODO: refactor to use components/forms and delete this component
const Input = ({...extra}) => (
  <div>
    <input
      className={classNames(
        'utrecht-textbox',
        'utrecht-textbox--html-input',
        'utrecht-textbox--openforms'
      )}
      {...extra}
    />
  </div>
);

export default Input;
