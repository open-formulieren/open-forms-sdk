<<<<<<< HEAD
import React from 'react';
import PropTypes from 'prop-types';
import {useRouteMatch} from 'react-router-dom';

import {SUBMISSION_ALLOWED} from 'components/constants';
import Types from 'types';
import {IsFormDesigner} from 'headers';

import ProgressIndicatorDisplay from './ProgressIndicatorDisplay';
import {STEP_LABELS} from './constants';

=======
import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useRouteMatch, Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import Anchor from "components/Anchor";
import { ConfigContext } from "Context";
import { useTitle } from "react-use";
import Card from "components/Card";
import { SUBMISSION_ALLOWED } from "components/constants";
import Caption from "components/Caption";
import List from "components/List";
import FAIcon from "components/FAIcon";
import Types from "types";
import { getBEMClassName } from "utils";
import { IsFormDesigner } from "headers";
import Body from "components/Body";

import ProgressItem from "./ProgressItem";

const getLinkModifiers = (active, isApplicable) => {
  return [
    "inherit",
    "hover",
    active ? "active" : undefined,
    isApplicable ? undefined : "muted",
  ].filter((mod) => mod !== undefined);
};

const LinkOrSpan = ({
  isActive,
  isApplicable,
  to,
  useLink,
  children,
  ...props
}) => {
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
    <Body component="span" modifiers={["muted"]} {...props}>
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
  isCurrent,
  step,
  canNavigate,
  isApplicable = false,
  completed = false,
}) => {
  return (
    <ProgressItem completed={completed}>
      <LinkOrSpan
        to={`/stap/${step.slug}`}
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
            label: step.formDefinition,
            isApplicable: isApplicable,
          }}
        />
      </LinkOrSpan>
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
  login: "Inloggen",
  overview: "Overzicht",
  confirmation: "Bevestiging",
};

>>>>>>> 6dc625b (shorten code to reduce blinking of document title)
const ProgressIndicator = ({
  title,
  submission = null,
  steps,
  submissionAllowed,
  completed = false,
}) => {
<<<<<<< HEAD
  const summaryMatch = !!useRouteMatch('/overzicht');
  const stepMatch = useRouteMatch('/stap/:step');
  const confirmationMatch = !!useRouteMatch('/bevestiging');
=======
  const summaryMatch = !!useRouteMatch("/overzicht");
  const stepMatch = useRouteMatch("/stap/:step");
  const confirmationMatch = !!useRouteMatch("/bevestiging");
>>>>>>> 6dc625b (shorten code to reduce blinking of document title)
  const isStartPage = !summaryMatch && stepMatch == null && !confirmationMatch;

  // figure out the slug from the currently active step IF we're looking at a step
  const stepSlug = stepMatch ? stepMatch.params.step : "";
  const hasSubmission = !!submission;

<<<<<<< HEAD
  const applicableSteps = hasSubmission ? submission.steps.filter(step => step.isApplicable) : [];
  const applicableAndCompletedSteps = applicableSteps.filter(step => step.completed);
  const applicableCompleted =
    hasSubmission && applicableSteps.length === applicableAndCompletedSteps.length;
=======
  const applicableSteps = hasSubmission
    ? submission.steps.filter((step) => step.isApplicable)
    : [];
  const applicableAndCompletedSteps = applicableSteps.filter(
    (step) => step.completed
  );
  const applicableCompleted =
    hasSubmission &&
    applicableSteps.length === applicableAndCompletedSteps.length;

  // meaningful titles based on steps
  const config = useContext(ConfigContext);
  let currentStepTitle = "";
>>>>>>> 6dc625b (shorten code to reduce blinking of document title)

  // figure out the title for the mobile menu based on the state
  let activeStepTitle;
  if (isStartPage) {
<<<<<<< HEAD
    activeStepTitle = STEP_LABELS.login;
  } else if (summaryMatch) {
    activeStepTitle = STEP_LABELS.overview;
  } else if (confirmationMatch) {
    activeStepTitle = STEP_LABELS.confirmation;
  } else {
    const step = steps.find(step => step.slug === stepSlug);
    activeStepTitle = step.formDefinition;
  }

  const canNavigateToStep = index => {
    // The user can navigate to a step when:
    // 1. All previous steps have been completed
    // 2. The user is a form designer
    if (IsFormDesigner.getValue()) return true;

    if (!submission) return false;

    const previousSteps = submission.steps.slice(0, index);
    const previousApplicableButNotCompletedSteps = previousSteps.filter(
      step => step.isApplicable && !step.completed
    );

    return !previousApplicableButNotCompletedSteps.length;
  };

  const getStepsInfo = steps => {
    return steps.map((step, index) => ({
      uuid: step.uuid,
      slug: step.slug,
      formDefinition: step.formDefinition,
      isCompleted: submission ? submission.steps[index].completed : false,
      isApplicable: submission ? submission.steps[index].isApplicable : true,
      isCurrent: step.slug === stepSlug,
      canNavigateTo: canNavigateToStep(index),
    }));
  };

  // try to get the value from the submission if provided, otherwise
  const submissionAllowedSpec = submission?.submissionAllowed ?? submissionAllowed;
  const showOverview = submissionAllowedSpec !== SUBMISSION_ALLOWED.noWithoutOverview;
  const showConfirmation = submissionAllowedSpec === SUBMISSION_ALLOWED.yes;

  return (
    <ProgressIndicatorDisplay
      activeStepTitle={activeStepTitle}
      formTitle={title}
      steps={getStepsInfo(steps)}
      hasSubmission={hasSubmission}
      isStartPage={isStartPage}
      isSummary={summaryMatch}
      isConfirmation={confirmationMatch}
      isSubmissionComplete={completed}
      areApplicableStepsCompleted={applicableCompleted}
      showOverview={showOverview}
      showConfirmation={showConfirmation}
    />
=======
    activeStepTitle = stepLabels.login;
    currentStepTitle = activeStepTitle;
  } else if (summaryMatch) {
    activeStepTitle = stepLabels.overview;
    currentStepTitle = activeStepTitle;
  } else if (confirmationMatch) {
    activeStepTitle = stepLabels.configuration;
    currentStepTitle = stepLabels.confirmation;
  } else {
    const step = steps.find((step) => step.slug === stepSlug);
    activeStepTitle = step.formDefinition;
  }

  const pageTitle = `${config.titlePrefix} - ${currentStepTitle}`;
  useTitle(pageTitle);

  const canNavigateToStep = (index) => {
    // The user can navigate to a step when:
    // 1. All previous steps have been completed
    // 2. The user is a form designer
    if (IsFormDesigner.getValue()) return true;

    if (!submission) return false;

    const previousSteps = submission.steps.slice(0, index);
    const previousApplicableButNotCompletedSteps = previousSteps.filter(
      (step) => step.isApplicable && !step.completed
    );

    return !previousApplicableButNotCompletedSteps.length;
  };

  // try to get the value from the submission if provided, otherwise
  const submissionAllowedSpec =
    submission?.submissionAllowed ?? submissionAllowed;
  const showOverview =
    submissionAllowedSpec !== SUBMISSION_ALLOWED.noWithoutOverview;
  const showConfirmation = submissionAllowedSpec === SUBMISSION_ALLOWED.yes;

  return (
    <Card
      blockClassName="progress-indicator"
      modifiers={expanded ? [] : ["mobile-collapsed"]}
    >
      <div
        className={getBEMClassName("progress-indicator__mobile-header")}
        onClick={() => setExpanded(!expanded)}
      >
        <FAIcon
          icon={expanded ? "chevron-up" : "chevron-down"}
          modifiers={["normal"]}
        />
        <span className={getBEMClassName("progress-indicator__active-step")}>
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
        {steps.map((step, index) => (
          <SidebarStepStatus
            key={step.uuid}
            step={step}
            completed={submission ? submission.steps[index].completed : false}
            isApplicable={
              submission ? submission.steps[index].isApplicable : true
            }
            canNavigate={canNavigateToStep(index)}
            isCurrent={step.slug === stepSlug}
            slug={step.slug}
          />
        ))}
        {showOverview && (
          <ProgressItem completed={confirmationMatch}>
            <LinkOrSpan
              to={"/overzicht"}
              useLink={applicableCompleted}
              isActive={summaryMatch}
              isApplicable={applicableCompleted}
            >
              {stepLabels.overview}
            </LinkOrSpan>
          </ProgressItem>
        )}
        {showConfirmation && (
          <ProgressItem completed={completed}>
            <Body component="span" modifiers={completed ? [] : ["muted"]}>
              {stepLabels.confirmation}
            </Body>
          </ProgressItem>
        )}
      </List>
    </Card>
>>>>>>> 6dc625b (shorten code to reduce blinking of document title)
  );
};

ProgressIndicator.propTypes = {
  title: PropTypes.string,
  submission: Types.Submission,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
      index: PropTypes.number.isRequired,
      slug: PropTypes.string.isRequired,
      formDefinition: PropTypes.string.isRequired,
    })
  ).isRequired,
<<<<<<< HEAD
  submissionAllowed: PropTypes.oneOf(Object.values(SUBMISSION_ALLOWED)).isRequired,
=======
  submissionAllowed: PropTypes.oneOf(Object.values(SUBMISSION_ALLOWED))
    .isRequired,
>>>>>>> 6dc625b (shorten code to reduce blinking of document title)
  completed: PropTypes.bool,
};

export default ProgressIndicator;
