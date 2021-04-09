import React from 'react';
import PropTypes from 'prop-types';


const FormStepsSidebar = ({ steps }) => {
  return (
    <ul className="list">
      {steps.map( step => (
        <li className="list__item" key={step.uuid}>
          {step.formDefinition}
        </li>
      ))}
    </ul>
  );
};


FormStepsSidebar.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
      index: PropTypes.number.isRequired,
      formDefinition: PropTypes.string.isRequired,
    })).isRequired,
};


export default FormStepsSidebar;
