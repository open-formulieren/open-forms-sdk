import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, Link } from 'react-router-dom';

import Anchor from './Anchor';
import Card from './Card';
import List from './List';
import FAIcon from './FAIcon';


const getLinkModifiers = (active, available, completed) => {
  return [
    'inherit',
    'hover',
    active ? 'active' : undefined,
    available ? undefined : 'muted',
    completed ? undefined : 'indent',
  ].filter( mod => mod !== undefined );
};



const SidebarStepStatus = ({isCurrent, step, available=false, completed=false}) => {
  const icon = completed ? <FAIcon icon="check" modifiers={['small']} aria-hidden="true" /> : null;
  const linkText = ` ${step.formDefinition}`; // space required between icon and text
  const modifiers = getLinkModifiers(isCurrent, available, completed);

  if (available) {
    return (
      <Link modifiers={modifiers} component={Anchor} to={`/stap/${step.slug}`}>
        {icon}
        {linkText}
      </Link>
    );
  }
  return (
    <Anchor modifiers={modifiers} component="span">
      {icon}
      {linkText}
    </Anchor>
  );
};


SidebarStepStatus.propTypes = {
  isCurrent: PropTypes.bool.isRequired,
  completed: PropTypes.bool,
  available: PropTypes.bool,
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
        <Anchor href="#" modifiers={getLinkModifiers(isStartPage, true, hasSubmission)}>
          { hasSubmission ? <FAIcon icon="check" modifiers={['small']} aria-hidden="true" /> : null }
          {' Inloggen'}
        </Anchor>
        {
          steps.map( (step, index) => (
            <SidebarStepStatus
              key={step.uuid}
              step={step}
              completed={submission && submission.steps[index].completed}
              available={submission && submission.steps[index].available}
              isCurrent={step.slug === stepSlug}
              slug={step.slug}
            />
          ) )
        }
        <Anchor href="#" modifiers={getLinkModifiers(!!summaryMatch, false, false)}>{' Overzicht'}</Anchor>
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
