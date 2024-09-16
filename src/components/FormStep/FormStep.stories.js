import {expect, fn, userEvent, waitFor, within} from '@storybook/test';
import produce from 'immer';
import {getWorker} from 'msw-storybook-addon';
import {withRouter} from 'storybook-addon-remix-react-router';
import {v4 as uuid4} from 'uuid';

import {buildForm, buildSubmission} from 'api-mocks';
import {
  mockEmailVerificationPost,
  mockEmailVerificationVerifyCodePost,
} from 'components/EmailVerification/mocks';
import {AnalyticsToolsDecorator, ConfigDecorator} from 'story-utils/decorators';
import {sleep} from 'utils';

import FormStep from '.';
import {
  getSubmissionStepDetail,
  mockSubmissionLogicCheckPost,
  mockSubmissionStepGet,
  mockSubmissionValidatePost,
} from './mocks';

export default {
  title: 'Private API / FormStep',
  component: FormStep,
  decorators: [ConfigDecorator, withRouter, AnalyticsToolsDecorator],
  args: {
    onLogicChecked: fn(),
    onStepSubmitted: fn(),
    onDestroySession: fn(),
  },
  argTypes: {
    submission: {control: false},
    form: {control: false},
    routerArgs: {table: {disable: true}},
  },
  parameters: {
    config: {
      debug: false,
    },
    reactRouter: {
      location: {
        pathParams: {step: 'step-1'},
      },
      routing: '/stap/:step',
    },
  },
};

const worker = getWorker();

const render = ({
  // component props
  form,
  submission,
  onLogicChecked,
  onStepSubmitted,
  onDestroySession,
  // story args
  formioConfiguration,
  validationErrors = undefined,
}) => {
  // force mutation/re-render by using different step URLs every time
  submission = produce(submission, draftSubmission => {
    for (const step of draftSubmission.steps) {
      step.url = `${draftSubmission.url}/steps/${uuid4()}`;
    }
  });
  const submissionStepDetailBody = getSubmissionStepDetail({
    formioConfiguration: formioConfiguration,
  });
  worker.resetHandlers();
  worker.use(
    mockSubmissionStepGet(submissionStepDetailBody),
    mockSubmissionLogicCheckPost(submission, submissionStepDetailBody),
    mockSubmissionValidatePost(validationErrors),
    mockEmailVerificationPost,
    mockEmailVerificationVerifyCodePost
  );
  return (
    <FormStep
      form={form}
      submission={submission}
      onLogicChecked={onLogicChecked}
      onStepSubmitted={onStepSubmitted}
      onDestroySession={onDestroySession}
    />
  );
};

export const Default = {
  render,
  args: {
    formioConfiguration: {
      display: 'form',
      components: [
        {
          type: 'textfield',
          key: 'text1',
          label: 'Simple text field',
          description: 'A help text for the text field',
        },
        {
          type: 'radio',
          key: 'radio1',
          label: 'Radio choices',
          values: [
            {value: 'option1', label: 'Option1'},
            {value: 'option2', label: 'Option2'},
          ],
        },
      ],
    },
    form: buildForm(),
    submission: buildSubmission(),
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Afbreken'});
    await expect(abortButton).toBeVisible();
  },
};

export const SuspensionDisallowed = {
  name: 'Suspension disallowed',
  render,
  args: {
    formioConfiguration: {
      display: 'form',
      components: [
        {
          type: 'textfield',
          key: 'text1',
          label: 'Simple text field',
          description: 'A help text for the text field',
        },
        {
          type: 'radio',
          key: 'radio1',
          label: 'Radio choices',
          values: [
            {value: 'option1', label: 'Option1'},
            {value: 'option2', label: 'Option2'},
          ],
        },
      ],
    },
    form: buildForm({suspensionAllowed: false}),
    submission: buildSubmission(),
  },
};

export const Authenticated = {
  render,
  args: {
    formioConfiguration: {
      display: 'form',
      components: [
        {
          type: 'textfield',
          key: 'text1',
          label: 'Simple text field',
          description: 'A help text for the text field',
        },
        {
          type: 'radio',
          key: 'radio1',
          label: 'Radio choices',
          values: [
            {value: 'option1', label: 'Option1'},
            {value: 'option2', label: 'Option2'},
          ],
        },
      ],
    },
    form: buildForm(),
    submission: buildSubmission({isAuthenticated: true}),
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Uitloggen'});
    await expect(abortButton).toBeVisible();
  },
};

export const govmetricEnabled = {
  name: 'GovMetric enabled',
  render,
  args: {
    formioConfiguration: {
      display: 'form',
      components: [
        {
          type: 'textfield',
          key: 'text1',
          label: 'Simple text field',
          description: 'A help text for the text field',
        },
        {
          type: 'radio',
          key: 'radio1',
          label: 'Radio choices',
          values: [
            {value: 'option1', label: 'Option1'},
            {value: 'option2', label: 'Option2'},
          ],
        },
      ],
    },
    form: buildForm(),
    submission: buildSubmission(),
  },
  parameters: {
    analyticsToolsParams: {
      govmetricSourceId: '1234',
      govmetricSecureGuid: '',
      enableGovmetricAnalytics: true,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Afbreken'});
    await expect(abortButton).toBeVisible();
  },
};

export const EmailVerification = {
  render,
  args: {
    formioConfiguration: {
      display: 'form',
      components: [
        {
          type: 'email',
          key: 'email',
          label: 'Email address',
          description: 'Email component requiring verification',
          openForms: {
            requireVerification: true,
          },
        },
      ],
    },
    form: buildForm(),
    submission: buildSubmission(),
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Formio...
    await sleep(500);

    const emailInput = await canvas.findByLabelText('Email address');
    await userEvent.type(emailInput, 'openforms@example.com');
    await userEvent.click(canvas.getByRole('button', {name: 'Verify'}));

    const modal = await canvas.findByRole('dialog');
    expect(modal).toBeVisible();
    await userEvent.click(within(modal).getByRole('button', {name: 'Verstuur code'}));
    const codeInput = await within(modal).findByLabelText('Voer de bevestigingscode in');
    expect(codeInput).toBeVisible();

    await userEvent.type(codeInput, 'ABCD12');
    const submitButton = within(modal).getByRole('button', {name: 'Bevestigen'});
    await userEvent.click(submitButton);
    expect(await within(modal).findByText(/Je e-mailadres is bevestigd/)).toBeVisible();
  },
};

export const EmailVerificationNotDone = {
  render,
  args: {
    formioConfiguration: {
      display: 'form',
      components: [
        {
          type: 'email',
          key: 'email',
          label: 'Email address',
          description: 'Email component requiring verification',
          openForms: {
            requireVerification: true,
          },
        },
      ],
    },
    form: buildForm(),
    submission: buildSubmission(),
    validationErrors: {
      email: 'Email is not verified',
    },
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Formio...
    await sleep(500);

    await step('Enter email address', async () => {
      const emailInput = await canvas.findByLabelText('Email address');
      await userEvent.type(emailInput, 'openforms@example.com');
    });

    // wait for the logic check to complete, as it interferes with the submit button
    // disabled/enabled state
    await sleep(1000 + 500); // 1000ms debounce + some extra time

    const submitButton = await canvas.findByRole('button', {name: 'Next'});

    await step('attempt to submit the step', async () => {
      await userEvent.click(submitButton);
      expect(await canvas.findByText('Email is not verified')).toBeVisible();
      await waitFor(() => {
        expect(submitButton).toHaveAttribute('aria-disabled', 'true');
      });
    });

    await step('verify email address', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Verify'}));

      const modal = await canvas.findByRole('dialog');
      expect(modal).toBeVisible();
      await userEvent.click(within(modal).getByRole('button', {name: 'Verstuur code'}));
      const codeInput = await within(modal).findByLabelText('Voer de bevestigingscode in');
      expect(codeInput).toBeVisible();

      await userEvent.type(codeInput, 'ABCD12');
      const submitButton = within(modal).getByRole('button', {name: 'Bevestigen'});
      await userEvent.click(submitButton);
      expect(await within(modal).findByText(/Je e-mailadres is bevestigd/)).toBeVisible();
      // close modal
      await userEvent.click(within(modal).getByRole('button', {name: 'Sluiten'}));
    });

    await waitFor(() => {
      expect(submitButton).toHaveAttribute('aria-disabled', 'false');
    });
  },
};

export const BackendValidationError = {
  render,
  args: {
    formioConfiguration: {
      display: 'form',
      components: [
        {
          type: 'textfield',
          key: 'text1',
          label: 'Simple text field',
        },
      ],
    },
    form: buildForm(),
    submission: buildSubmission(),
    validationErrors: {
      text1: 'Server side validation error',
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Formio needs some time to properly initialize...
    await sleep(500);

    // wait for the logic check to complete, as it interferes with the submit button
    // disabled/enabled state
    await sleep(1000 + 200); // 1000ms debounce + some extra time

    // Once submitted and server side validation errors are displayed, the submit
    // button remains disabled until the input is corrected.
    const submitButton = await canvas.findByRole('button', {name: 'Next'});
    await userEvent.click(submitButton);
    expect(await canvas.findByText('Server side validation error')).toBeVisible();
    await waitFor(() => {
      expect(submitButton).toHaveAttribute('aria-disabled', 'true');
    });

    // check that modifying the input enables the submit button again
    await userEvent.type(canvas.getByLabelText('Simple text field'), 'Foo');
    await waitFor(
      () => {
        expect(submitButton).toHaveAttribute('aria-disabled', 'false');
      },
      {timeout: 2000}
    );
  },
};

export const SummaryProgressVisible = {
  render,
  args: {
    form: buildForm({showSummaryProgress: true}),
    submission: buildSubmission(),
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText(/Stap 1 van 1/)).toBeVisible();
  },
};

export const SummaryProgressNotVisible = {
  render,
  args: {
    form: buildForm(),
    submission: buildSubmission(),
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(canvas.queryByText(/Stap 1 van 1/)).toBeNull();
  },
};
