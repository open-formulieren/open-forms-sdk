import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

import Anchor from './Anchor';
import Card from './Card';
import List from './List';
import FAIcon from './FAIcon';


const getModifiers = (active, completed) => {
  return [
    'inherit',
    'hover',
    active ? 'active' : 'muted',
    completed ? undefined : 'indent',
  ].filter( mod => mod !== undefined );
};



const SidebarStepStatus = ({isCurrent, step, completed=false}) => {
  return (
    <Anchor href="#" modifiers={getModifiers(isCurrent, completed)}>
      { completed ? <FAIcon icon="check" modifiers={['small']} aria-hidden="true" /> : null }
      {step.formDefinition}
    </Anchor>
  );
};


SidebarStepStatus.propTypes = {
  isCurrent: PropTypes.bool.isRequired,
  completed: PropTypes.bool,
  step: PropTypes.shape({
    url: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    formDefinition: PropTypes.string.isRequired,
  }),
};


const FormStepsSidebar = ({ title, submission, steps }) => {
  const summaryMatch = useRouteMatch("/overzicht");
  const stepMatch = useRouteMatch("/stap/:step");
  const isStartPage = summaryMatch == null && stepMatch == null;
  // figure out the slug from the currently active step IF we're looking at a step
  const stepSlug = stepMatch ? stepMatch.params.step : '';
  const hasSubmission = !!submission;

  return (
    <Card caption={title} captionComponent="h3">
      <List ordered>
        <Anchor href="#" modifiers={getModifiers(isStartPage, hasSubmission)}>
          { hasSubmission ? <FAIcon icon="check" modifiers={['small']} aria-hidden="true" /> : null }
          Inloggen
        </Anchor>
        {
          steps.map( (step, index) => (
            <SidebarStepStatus
              key={step.uuid}
              step={step}
              completed={submission && submission.steps[index].completed}
              isCurrent={step.slug === stepSlug}
              slug={step.slug}
            />
          ) )
        }
        <Anchor href="#" modifiers={getModifiers(!!summaryMatch)}>Overzicht</Anchor>
      </List>
    </Card>
  );
};


FormStepsSidebar.propTypes = {
  title: PropTypes.string,
  submission: PropTypes.shape({
    steps: PropTypes.arrayOf(PropTypes.shape({
      completed: PropTypes.bool.isRequired,
      available: PropTypes.bool.isRequired,
      // and more...
    })),
  }),
  steps: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    formDefinition: PropTypes.string.isRequired,
  })).isRequired,
};


export default FormStepsSidebar;
