import type {IntlShape} from 'react-intl';

import {STEP_LABELS} from '@/components/constants';
import type {Form} from '@/data/forms';
import type {Submission} from '@/data/submissions';
import {IsFormDesigner} from '@/headers';
import {checkMatchesPath} from '@/routes/utils';

const canNavigateToStep = (index: number, submission: Submission | null): boolean => {
  // The user can navigate to a step when:
  // 1. All previous steps have been completed
  // 2. The user is a form designer
  if (IsFormDesigner.getValue()) return true;

  if (!submission) return false;

  const previousSteps = submission.steps.slice(0, index);
  const previousApplicableButNotCompletedSteps = previousSteps.filter(
    step => step.isApplicable && !step.completed
  );

  // If a step is not applicable but we have chosen to show it, it should not be able to
  // navigate to it.
  return !previousApplicableButNotCompletedSteps.length && submission.steps[index].isApplicable;
};

export interface StepMeta {
  to: string;
  label: string;
  isCompleted: boolean;
  isApplicable: boolean;
  canNavigateTo: boolean;
  isCurrent: boolean;
}

const getStepsInfo = (
  formSteps: Form['steps'],
  submission: Submission | null,
  currentPathname: string
): StepMeta[] =>
  formSteps.map((step, index) => {
    // this fallback should never happen, but our (API) type definitions show that in theory
    // the slug can be absent or null from the server.
    // FIXME: update the API specification.
    const slug = step.slug ?? '__fallback__';
    return {
      to: `/stap/${slug}`,
      label: step.formDefinition,
      isCompleted: submission ? submission.steps[index].completed : false,
      isApplicable: submission ? submission.steps[index].isApplicable : (step.isApplicable ?? true),
      isCurrent: checkMatchesPath(currentPathname, slug),
      canNavigateTo: canNavigateToStep(index, submission),
    };
  });

const addFixedSteps = (
  intl: IntlShape,
  steps: StepMeta[],
  submission: Submission | null,
  currentPathname: string,
  showOverview: boolean,
  needsPayment: boolean,
  completed = false,
  hasIntroduction = false
): StepMeta[] => {
  const hasSubmission = !!submission;
  const isPayment = checkMatchesPath(currentPathname, 'betalen');
  const applicableSteps = hasSubmission ? submission.steps.filter(step => step.isApplicable) : [];
  const applicableAndCompletedSteps = applicableSteps.filter(step => step.completed);
  const applicableCompleted =
    hasSubmission && applicableSteps.length === applicableAndCompletedSteps.length;

  const introductionPageStep: StepMeta = {
    to: '../introductie',
    label: intl.formatMessage(STEP_LABELS.introduction),
    isCompleted: true,
    isApplicable: true,
    canNavigateTo: true,
    isCurrent: checkMatchesPath(currentPathname, 'introductie'),
  };

  const startPageStep: StepMeta = {
    to: '../startpagina',
    label: intl.formatMessage(STEP_LABELS.login),
    isCompleted: hasSubmission,
    isApplicable: true,
    canNavigateTo: true,
    isCurrent: checkMatchesPath(currentPathname, 'startpagina'),
  };

  const summaryStep: StepMeta = {
    to: '../overzicht',
    label: intl.formatMessage(STEP_LABELS.overview),
    isCompleted: isPayment,
    isApplicable: true,
    isCurrent: checkMatchesPath(currentPathname, 'overzicht'),
    canNavigateTo: applicableCompleted,
  };

  const paymentStep: StepMeta = {
    to: '../betalen',
    label: intl.formatMessage(STEP_LABELS.payment),
    isCompleted: false,
    isApplicable: needsPayment,
    isCurrent: isPayment,
    canNavigateTo: completed,
  };

  const finalSteps = [
    hasIntroduction && introductionPageStep,
    startPageStep,
    ...steps,
    showOverview && summaryStep,
    needsPayment && paymentStep,
  ].filter(step => !!step);
  return finalSteps;
};

export {addFixedSteps, getStepsInfo};
