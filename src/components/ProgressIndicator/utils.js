import {checkMatchesPath} from 'components/utils/routers';
import {IsFormDesigner} from 'headers';

const canNavigateToStep = (index, submission) => {
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

const getStepsInfo = (formSteps, submission, currentPathname) => {
  return formSteps.map((step, index) => ({
    uuid: step.uuid,
    slug: step.slug,
    to: `/stap/${step.slug}` || '#',
    formDefinition: step.formDefinition,
    isCompleted: submission ? submission.steps[index].completed : false,
    isApplicable: submission ? submission.steps[index].isApplicable : step.isApplicable ?? true,
    isCurrent: checkMatchesPath(currentPathname, step.slug),
    canNavigateTo: canNavigateToStep(index, submission),
  }));
};

const addFixedSteps = (
  steps,
  submission,
  currentPathname,
  showOverview,
  showConfirmation,
  completed = false
) => {
  const hasSubmission = !!submission;
  const isConfirmation = checkMatchesPath(currentPathname, 'bevestiging');
  const applicableSteps = hasSubmission ? submission.steps.filter(step => step.isApplicable) : [];
  const applicableAndCompletedSteps = applicableSteps.filter(step => step.completed);
  const applicableCompleted =
    hasSubmission && applicableSteps.length === applicableAndCompletedSteps.length;

  const startPageStep = {
    slug: 'startpagina',
    to: '#',
    formDefinition: 'Start page',
    isCompleted: hasSubmission,
    isApplicable: true,
    canNavigateTo: true,
    isCurrent: checkMatchesPath(currentPathname, 'startpagina'),
  };

  const summaryStep = {
    slug: 'overzicht',
    to: 'overzicht',
    formDefinition: 'Summary',
    isCompleted: isConfirmation,
    isApplicable: true,
    isCurrent: checkMatchesPath(currentPathname, 'overzicht'),
    canNavigateTo: false,
  };

  const confirmationStep = {
    slug: 'bevestiging',
    to: 'bevestiging',
    formDefinition: 'Confirmation',
    isCompleted: completed,
    isCurrent: checkMatchesPath(currentPathname, 'bevestiging'),
  };

  const finalSteps = [
    startPageStep,
    ...steps,
    showOverview && summaryStep,
    showConfirmation && confirmationStep,
  ];

  if (showOverview) {
    const summaryStepIndex = finalSteps.findIndex(step => step.slug === 'overzicht');
    finalSteps[summaryStepIndex].canNavigateTo = applicableCompleted;
  }

  return finalSteps;
};

export {addFixedSteps, getStepsInfo};
