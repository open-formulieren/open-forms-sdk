import React from 'react';
import PropTypes from 'prop-types';

import Anchor from './Anchor';
import Card from './Card';
import List from './List';


const FormStepsSidebar = ({ title, steps }) => {
  return (
    <Card caption={title} captionComponent="h3">
      <List ordered>
        {
          steps.map( step => (
            <Anchor href="#" modifiers={['inherit',/* 'active',*/ 'hover', 'muted', 'indent']} key={step.uuid}>
              {step.formDefinition}
            </Anchor>
          ) )
        }
      </List>
    </Card>
  );
};


FormStepsSidebar.propTypes = {
  title: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    formDefinition: PropTypes.string.isRequired,
  })).isRequired,
};


export default FormStepsSidebar;
