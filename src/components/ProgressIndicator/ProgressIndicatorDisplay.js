import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {Link} from 'react-router-dom';

import Anchor from 'components/Anchor';
import Body from 'components/Body';
import Caption from 'components/Caption';
import Card from 'components/Card';
import FAIcon from 'components/FAIcon';
import List from 'components/List';
import {getBEMClassName} from 'utils';

import ProgressItem from './ProgressItem';
import {STEP_LABELS} from './constants';

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
        aria-label={formDefinition}
        title={formDefinition}
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

  const intl = useIntl();
  // Wrapper may be a DOM element, which can't handle <FormattedMessage />
  const ariaIconLabel = intl.formatMessage({
    description: 'Toggle active step progress indicator icon',
    defaultMessage: 'Progress step indicator icon',
  });
  const toggleStepsTitle = intl.formatMessage({
    description: 'Active step toggle titles',
    defaultMessage: 'Show/hide steps',
  });

  return (
    <Card blockClassName="progress-indicator" modifiers={expanded ? [] : ['mobile-collapsed']}>
      {/* Turn a Div with an onClick event into a button for accesibility */}
      <button
        className={getBEMClassName('progress-indicator__mobile-header')}
        aria-pressed={expanded ? 'true' : 'false'}
        onClick={() => setExpanded(!expanded)}
      >
        <FAIcon
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          modifiers={['normal']}
          aria-label={ariaIconLabel}
        />
        <span
          className={getBEMClassName('progress-indicator__active-step')}
          title={toggleStepsTitle}
        >
          {activeStepTitle}
        </span>
      </button>

      <Caption component="h2">{formTitle}</Caption>

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
