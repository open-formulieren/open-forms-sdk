import {checkMatchesPath} from 'components/appointments/CreateAppointment/routes';
import {STEP_LABELS} from 'components/constants';
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

  // If any step cannot be submitted, there should NOT be an active link to the overview page.
  const canSubmitSteps = hasSubmission
    ? submission.steps.filter(step => !step.canSubmit).length === 0
    : false;

  steps.splice(0, 0, {
    slug: 'startpagina',
    to: '#',
    formDefinition: 'Start page',
    isCompleted: hasSubmission,
    isApplicable: true,
    canNavigateTo: true,
    isCurrent: checkMatchesPath(currentPathname, 'startpagina'),
    fixedText: STEP_LABELS.login,
  });

  if (showOverview) {
    steps.splice(steps.length, 0, {
      slug: 'overzicht',
      to: 'overzicht',
      formDefinition: 'Summary',
      isCompleted: isConfirmation,
      isApplicable: applicableCompleted && canSubmitSteps,
      isCurrent: checkMatchesPath(currentPathname, 'overzicht'),
      fixedText: STEP_LABELS.overview,
    });
    const summaryPage = steps[steps.length - 1];
    summaryPage.canNavigateTo = canNavigateToStep(steps.length - 1, submission);
  }

  if (showConfirmation) {
    steps.splice(steps.length, 0, {
      slug: 'bevestiging',
      to: 'bevestiging',
      formDefinition: 'Confirmation',
      isCompleted: completed,
      isCurrent: checkMatchesPath(currentPathname, 'bevestiging'),
      fixedText: STEP_LABELS.confirmation,
    });
  }

  return steps;
};

export {addFixedSteps, getStepsInfo};
