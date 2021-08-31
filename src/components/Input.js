import React from 'react';

import {getBEMClassName} from 'utils';


const Input = ({ ...extra }) => {

  return (
    <input className={getBEMClassName("input")} {...extra}/>
  )
};

export default Input;
