import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, Link } from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import Anchor from 'components/Anchor';
import Card from 'components/Card';
import {SUBMISSION_ALLOWED} from 'components/constants';
import Caption from 'components/Caption';
import List from 'components/List';
import FAIcon from 'components/FAIcon';
import Types from 'types';
import {getBEMClassName} from 'utils';
import {IsFormDesignerHeader} from 'headers';

import ProgressItem from './ProgressItem';


const getLinkModifiers = (active, isApplicable) => {
  return [
    'inherit',
    'hover',
    active ? 'active' : undefined,
    isApplicable ? undefined : 'muted',
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


const SidebarStepStatus = ({isCurrent, step, canNavigate, isApplicable=false, completed=false}) => {
  const modifiers = getLinkModifiers(isCurrent, isApplicable);
  return (
    <ProgressItem completed={completed}>
      <LinkOrDisabledAnchor to={`/stap/${step.slug}`} useLink={isApplicable && canNavigate} modifiers={modifiers}>
        <FormattedMessage
          description="Step label in progress indicator"
          defaultMessage={`
            {isApplicable, select,
              false {{label} (n/a)}
              other {{label}}
            }`}
          values={{
            label: step.formDefinition,
            isApplicable: isApplicable,
          }}
        />
      </LinkOrDisabledAnchor>
    </ProgressItem>
  );
};

SidebarStepStatus.propTypes = {
  isCurrent: PropTypes.bool.isRequired,
  completed: PropTypes.bool,
  canNavigate: PropTypes.bool,
  isApplicable: PropTypes.bool,
  step: PropTypes.shape({
    url: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    formDefinition: PropTypes.string.isRequired,
  }),
};


// TODO: translate these
const stepLabels = {
  login: 'Inloggen',
  overview: 'Overzicht',
  confirmation: 'Bevestiging',
};


const ProgressIndicator = ({ title, submission=null, steps, submissionAllowed, completed=false }) => {
  const summaryMatch = !!useRouteMatch('/overzicht');
  const stepMatch = useRouteMatch('/stap/:step');
  const confirmationMatch = !!useRouteMatch('/bevestiging');
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

    const canNavigateToStep = (index) => {
      // The user can navigate to a step when:
      // 1. All previous steps have been completed
      // 2. The user is a form designer
      if (IsFormDesignerHeader.getValue()) return true;

      if (!submission) return false;

      const previousSteps = submission.steps.slice(0, index);
      const previousApplicableButNotCompletedSteps = previousSteps.filter(
        step => step.isApplicable && !step.completed
      )

      return !previousApplicableButNotCompletedSteps.length
    };

  // try to get the value from the submission if provided, otherwise
  const submissionAllowedSpec = submission?.submissionAllowed ?? submissionAllowed;
  const showOverview = (submissionAllowedSpec !== SUBMISSION_ALLOWED.noWithoutOverview);
  const showConfirmation = (submissionAllowedSpec === SUBMISSION_ALLOWED.yes);

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
        <ProgressItem completed={hasSubmission}>
          <Anchor href="#" modifiers={getLinkModifiers(isStartPage, true)}>
            {stepLabels.login}
          </Anchor>
        </ProgressItem>
        {
          steps.map( (step, index) => (
            <SidebarStepStatus
              key={step.uuid}
              step={step}
              completed={submission ? submission.steps[index].completed : false}
              isApplicable={submission ? submission.steps[index].isApplicable : true}
              canNavigate={canNavigateToStep(index)}
              isCurrent={step.slug === stepSlug}
              slug={step.slug}
            />
          ) )
        }
        {
          showOverview
          && (
            <ProgressItem completed={confirmationMatch}>
              <LinkOrDisabledAnchor
                to={'/overzicht'}
                useLink={applicableCompleted}
                modifiers={getLinkModifiers(summaryMatch, applicableCompleted)}
              >
                {stepLabels.overview}
              </LinkOrDisabledAnchor>
            </ProgressItem>
          )
        }
        {
          showConfirmation
          && (
            <ProgressItem completed={completed}>
              <Anchor
                component="span"
                modifiers={getLinkModifiers(confirmationMatch, confirmationMatch && applicableCompleted)}
              >{stepLabels.confirmation}</Anchor>
            </ProgressItem>
          )
        }
      </List>
    </Card>
  );
};


ProgressIndicator.propTypes = {
  title: PropTypes.string,
  submission: Types.Submission,
  steps: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    formDefinition: PropTypes.string.isRequired,
  })).isRequired,
  submissionAllowed: PropTypes.oneOf(Object.values(SUBMISSION_ALLOWED)).isRequired,
  completed: PropTypes.bool,
};


export default ProgressIndicator;
