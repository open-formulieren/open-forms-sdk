/**
 * Helpers related to steps in a submission.
 */
import type {Form, MinimalFormStep} from '@/data/forms';
import type {Submission} from '@/data/submissions';

export class StepState {
  protected form: Form;
  protected submission: Submission;
  protected currentStep: MinimalFormStep;

  private currentStepIndex: number;

  constructor(form: Form, submission: Submission, currentStep: MinimalFormStep) {
    this.form = form;
    this.submission = submission;
    this.currentStep = currentStep;

    if (this.form.steps.length !== this.submission.steps.length) {
      console.warn('Submission and form do not have equal amount of steps!');
    }

    this.currentStepIndex = form.steps.indexOf(currentStep);
    if (this.currentStepIndex === -1) {
      throw new Error('Step not found!');
    }
  }

  /**
   * Return the URL route for the last applicable step, or the startpage if none match.
   */
  static getLastApplicableStepTo(form: Form, submission: Submission): string {
    let candidateStepIndex = submission.steps.length - 1;
    while (candidateStepIndex >= 0 && !submission.steps[candidateStepIndex].isApplicable) {
      candidateStepIndex = candidateStepIndex - 1;
      if (candidateStepIndex < 0) return '/';
    }
    const step = form.steps[candidateStepIndex];
    return `/stap/${step.slug}`;
  }

  /**
   * Calculate the previous step that is applicable in the current submission context.
   *
   * Finds the nearest previous step that is not marked as "not applicable" by the
   * backend, which may change dynamically because of form logic.
   */
  public get previousApplicableStep(): MinimalFormStep | null {
    const submissionSteps = this.submission.steps;
    let candidateStepIndex = this.currentStepIndex - 1;
    while (candidateStepIndex >= 0 && !submissionSteps[candidateStepIndex].isApplicable) {
      candidateStepIndex = candidateStepIndex - 1;
      if (candidateStepIndex < 0) return null;
    }
    return this.form.steps[candidateStepIndex] ?? null;
  }

  /**
   * Return the URL route for the "previous" link.
   *
   * If there are applicable previous steps, point to the nearest one, otherwise return
   * to the start page.
   */
  public get previousTo(): string {
    const previousStep = this.previousApplicableStep;
    if (previousStep === null) return '/';
    return `/stap/${previousStep.slug}`;
  }

  /**
   * Calculate the next step that is applicable in the current submission context.
   *
   * Finds the nearest next step that is not marked as "not applicable" by the
   * backend, which may change dynamically because of form logic.
   */
  public get nextApplicableStep(): MinimalFormStep | null {
    const submissionSteps = this.submission.steps;
    let candidateStepIndex = this.currentStepIndex + 1;

    // if we exceed the available steps, return null to indicate no matching step was
    // found, since the maximum available index is `steps.length - 1`
    if (candidateStepIndex >= submissionSteps.length) return null;

    while (!submissionSteps[candidateStepIndex].isApplicable) {
      candidateStepIndex = candidateStepIndex + 1;
      if (!submissionSteps[candidateStepIndex]) break;
    }
    return this.form.steps[candidateStepIndex] ?? null;
  }

  /**
   * Return the URL route for the "next" button.
   *
   * If there are applicable next steps, point to the nearest one, otherwise continue
   * to the summary page.
   */
  public get nextTo(): string {
    const nextStep = this.nextApplicableStep;
    if (nextStep === null) return '/overzicht';
    return `/stap/${nextStep.slug}`;
  }

  /**
   * Determine if the current step is the last step, irrespective whether it's applicable
   * or not.
   *
   * @todo It looks like a bug that the last-step detection doesn't account for non-applicable
   * steps? Need to confirm.
   */
  public get isLastStep(): boolean {
    return this.currentStepIndex === this.submission.steps.length - 1;
  }
}
