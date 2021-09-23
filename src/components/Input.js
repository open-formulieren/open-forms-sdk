import React from 'react';

import {getBEMClassName} from 'utils';


const Input = ({ ...extra }) => (
  <div>
    <input className={getBEMClassName("input")} {...extra} />
  </div>
);

export default Input;
