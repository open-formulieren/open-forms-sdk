import React, {useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';
import FAIcon from 'components/FAIcon';
import Caption from 'components/Caption';
import Anchor from 'components/Anchor';
import Body from 'components/Body';
import Card from 'components/Card';
import List from 'components/List';

import {STEP_LABELS} from './constants';
import ProgressItem from './ProgressItem';

const getLinkModifiers = (active, isApplicable) => {
  return [
    'inherit',
    'hover',
    active ? 'active' : undefined,
    isApplicable ? undefined : 'muted',
  ].filter(mod => mod !== undefined);
};

const LinkOrSpan = ({isActive, isApplicable, to, useLink, children, ...props}) => {
  if (useLink) {
    return (
      <Link
        to={to}
        component={Anchor}
        modifiers={getLinkModifiers(isActive, isApplicable)}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <Body component="span" modifiers={['muted']} {...props}>
      {children}
    </Body>
  );
};

LinkOrSpan.propTypes = {
  to: PropTypes.string.isRequired,
  useLink: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  isApplicable: PropTypes.bool.isRequired,
};

const SidebarStepStatus = ({
  slug,
  formDefinition,
  canNavigate,
  isCurrent,
  isApplicable = false,
  completed = false,
}) => {
  return (
    <ProgressItem completed={completed}>
      <LinkOrSpan
        to={`/stap/${slug}`}
        useLink={isApplicable && canNavigate}
        isActive={isCurrent}
        isApplicable={isApplicable}
      >
        <FormattedMessage
          description="Step label in progress indicator"
          defaultMessage={`
            {isApplicable, select,
              false {{label} (n/a)}
              other {{label}}
            }`}
          values={{
            label: formDefinition,
            isApplicable: isApplicable,
          }}
        />
      </LinkOrSpan>
    </ProgressItem>
  );
};

SidebarStepStatus.propTypes = {
  slug: PropTypes.string.isRequired,
  formDefinition: PropTypes.string.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  completed: PropTypes.bool,
  canNavigate: PropTypes.bool,
  isApplicable: PropTypes.bool,
};

const ProgressIndicatorDisplay = ({
  activeStepTitle,
  formTitle,
  steps,
  hasSubmission,
  isStartPage,
  isSummary,
  isConfirmation,
  isSubmissionComplete,
  areApplicableStepsCompleted,
  showOverview,
  showConfirmation,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card blockClassName="progress-indicator" modifiers={expanded ? [] : ['mobile-collapsed']}>
      <div
        className={getBEMClassName('progress-indicator__mobile-header')}
        onClick={() => setExpanded(!expanded)}
      >
        <FAIcon icon={expanded ? 'chevron-up' : 'chevron-down'} modifiers={['normal']} />
        <span className={getBEMClassName('progress-indicator__active-step')}>
          {activeStepTitle}
        </span>
      </div>

      <Caption component="h3">{formTitle}</Caption>

      <List ordered>
        <ProgressItem completed={hasSubmission}>
          <Anchor href="#" modifiers={getLinkModifiers(isStartPage, true)}>
            {STEP_LABELS.login}
          </Anchor>
        </ProgressItem>
        {steps.map((step, _) => (
          <SidebarStepStatus
            key={step.uuid}
            slug={step.slug}
            formDefinition={step.formDefinition}
            completed={step.isCompleted}
            isApplicable={step.isApplicable}
            canNavigate={step.canNavigateTo}
            isCurrent={step.isCurrent}
          />
        ))}
        {showOverview && (
          <ProgressItem completed={isConfirmation}>
            <LinkOrSpan
              to={'/overzicht'}
              useLink={areApplicableStepsCompleted}
              isActive={isSummary}
              isApplicable={areApplicableStepsCompleted}
            >
              {STEP_LABELS.overview}
            </LinkOrSpan>
          </ProgressItem>
        )}
        {showConfirmation && (
          <ProgressItem completed={isSubmissionComplete}>
            <Body component="span" modifiers={isSubmissionComplete ? [] : ['muted']}>
              {STEP_LABELS.confirmation}
            </Body>
          </ProgressItem>
        )}
      </List>
    </Card>
  );
};

ProgressIndicatorDisplay.propTypes = {
  activeStepTitle: PropTypes.node,
  formTitle: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string,
      slug: PropTypes.string,
      formDefinition: PropTypes.string,
      isCompleted: PropTypes.bool,
      isApplicable: PropTypes.bool,
      isCurrent: PropTypes.bool,
      canNavigateTo: PropTypes.bool,
    })
  ),
  hasSubmission: PropTypes.bool,
  isStartPage: PropTypes.bool,
  isSummary: PropTypes.bool,
  isConfirmation: PropTypes.bool,
  isSubmissionComplete: PropTypes.bool,
  areApplicableStepsCompleted: PropTypes.bool,
  showOverview: PropTypes.bool,
  showConfirmation: PropTypes.bool,
};

export default ProgressIndicatorDisplay;
