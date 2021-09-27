import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, Link } from 'react-router-dom';

import Anchor from 'components/Anchor';
import Card from 'components/Card';
import Caption from 'components/Caption';
import List from 'components/List';
import FAIcon from 'components/FAIcon';
import { getBEMClassName } from 'utils';


const getLinkModifiers = (active, isApplicable, completed) => {
  return [
    'inherit',
    'hover',
    active ? 'active' : undefined,
    isApplicable ? undefined : 'muted',
    completed ? undefined : 'indent',
  ].filter( mod => mod !== undefined );
};


const LinkOrDisabledAnchor = ({ to, useLink, children, ...props }) => {
  if (useLink) {
    return <Link to={to} component={Anchor} {...props}>{children}</Link>
  }
  return <Anchor component="span" {...props}>{children}</Anchor>
};

LinkOrDisabledAnchor.propTypes = {
  to: PropTypes.string.isRequired,
  useLink: PropTypes.bool.isRequired,
};


const CompletionMark = ({completed=false}) => {
  if (!completed) return null;
  return (<FAIcon icon="check" modifiers={['small']} aria-hidden="true" />);
};

CompletionMark.propTypes = {
  completed: PropTypes.bool,
};


const SidebarStepStatus = ({isCurrent, step, isApplicable=false, completed=false}) => {
  const modifiers = getLinkModifiers(isCurrent, isApplicable, completed);
  const linkText = ` ${step.formDefinition} ${!isApplicable ? ' (n.v.t)' : ''}`; // space required between icon and text
  return (
    <LinkOrDisabledAnchor to={`/stap/${step.slug}`} useLink={isApplicable} modifiers={modifiers}>
      <CompletionMark completed={completed} />
      {linkText}
    </LinkOrDisabledAnchor>
  );
};


SidebarStepStatus.propTypes = {
  isCurrent: PropTypes.bool.isRequired,
  completed: PropTypes.bool,
  isApplicable: PropTypes.bool,
  step: PropTypes.shape({
    url: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    formDefinition: PropTypes.string.isRequired,
  }),
};



const stepLabels = {
  login: 'Inloggen',
  overview: 'Overzicht',
  confirmation: 'Bevestiging',
};


const ProgressIndicator = ({ title, submission, steps }) => {
  const summaryMatch = !!useRouteMatch("/overzicht");
  const stepMatch = useRouteMatch("/stap/:step");
  const confirmationMatch = !!useRouteMatch("/bevestiging");
  const isStartPage = !summaryMatch && stepMatch == null && !confirmationMatch;

  const [expanded, setExpanded] = useState(false);

  // figure out the slug from the currently active step IF we're looking at a step
  const stepSlug = stepMatch ? stepMatch.params.step : '';
  const hasSubmission = !!submission;

  const applicableSteps = hasSubmission ? submission.steps.filter(step => step.isApplicable) : [];
  const applicableAndCompletedSteps = applicableSteps.filter(step => step.completed);
  const applicableCompleted = applicableSteps.length === applicableAndCompletedSteps.length;

  // figure out the title for the mobile menu based on the state
  let activeStepTitle;
  if (isStartPage) {
    activeStepTitle = stepLabels.login;
  } else if (summaryMatch) {
    activeStepTitle = stepLabels.overview;
  } else if (confirmationMatch) {
    activeStepTitle = stepLabels.configuration;
  } else {
    const step = steps.find( step => step.slug === stepSlug);
    activeStepTitle = step.formDefinition;
  }

  return (
    <Card blockClassName="progress-indicator" modifiers={expanded ? [] : ['mobile-collapsed']}>

      <div className={getBEMClassName('progress-indicator__mobile-header')} onClick={() => setExpanded(!expanded)}>
        <FAIcon icon={expanded ? 'chevron-up' : 'chevron-down' } modifiers={['normal']} />
        <span className={getBEMClassName('progress-indicator__active-step')}>
          {activeStepTitle}
        </span>
      </div>

      <Caption component="h3">{title}</Caption>

      <List ordered>
        <Anchor href="#" modifiers={getLinkModifiers(isStartPage, true, hasSubmission)}>
          <CompletionMark completed={hasSubmission} />
          {` ${stepLabels.login}`}
        </Anchor>
        {
          steps.map( (step, index) => (
            <SidebarStepStatus
              key={step.uuid}
              step={step}
              completed={submission ? submission.steps[index].completed : false}
              isApplicable={submission ? submission.steps[index].isApplicable : true}
              isCurrent={step.slug === stepSlug}
              slug={step.slug}
            />
          ) )
        }
        <LinkOrDisabledAnchor
          to={'/overzicht'}
          useLink={applicableCompleted}
          modifiers={getLinkModifiers(summaryMatch, applicableCompleted, confirmationMatch)}
        >
          <CompletionMark completed={confirmationMatch} />
          {` ${stepLabels.overview}`}
        </LinkOrDisabledAnchor>
        <Anchor
          component="span"
          modifiers={getLinkModifiers(confirmationMatch, confirmationMatch && applicableCompleted, false)}
        >{` ${stepLabels.confirmation}`}</Anchor>
      </List>
    </Card>
  );
};


ProgressIndicator.propTypes = {
  title: PropTypes.string,
  submission: PropTypes.shape({
    steps: PropTypes.arrayOf(PropTypes.shape({
      completed: PropTypes.bool.isRequired,
      isApplicable: PropTypes.bool.isRequired,
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


export default ProgressIndicator;
