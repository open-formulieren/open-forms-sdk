import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

import Anchor from './Anchor';
import Card from './Card';
import List from './List';


const getModifiers = (active) => {
  const base = ['inherit', 'hover'];
  const extra = active
    ? ['active']
    : ['muted', 'indent'];
  return [...base, ...extra];
};



const FormStepsSidebar = ({ title, steps }) => {
  const summaryMatch = useRouteMatch("/overzicht");
  const stepMatch = useRouteMatch("/stap/:step");
  const isStartPage = summaryMatch == null && stepMatch == null;
  // figure out the slug from the currently active step IF we're looking at a step
  const stepSlug = stepMatch ? stepMatch.params.step : '';

  return (
    <Card caption={title} captionComponent="h3">
      <List ordered>
        <Anchor href="#" modifiers={getModifiers(isStartPage)}>Inloggen</Anchor>
        {
          steps.map( step => (
            <Anchor href="#" modifiers={getModifiers(step.slug === stepSlug)} key={step.uuid}>
              {step.formDefinition}
            </Anchor>
          ) )
        }
        <Anchor href="#" modifiers={getModifiers(!!summaryMatch)}>Overzicht</Anchor>
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
    slug: PropTypes.string.isRequired,
    formDefinition: PropTypes.string.isRequired,
  })).isRequired,
};


export default FormStepsSidebar;
