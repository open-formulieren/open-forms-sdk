import {expect} from '@storybook/jest';
import {within} from '@storybook/testing-library';
import produce from 'immer';
import {getWorker} from 'msw-storybook-addon';
import {withRouter} from 'storybook-addon-react-router-v6';
import {v4 as uuid4} from 'uuid';

import {buildForm, buildSubmission} from 'api-mocks';
import {AnalyticsToolsDecorator, ConfigDecorator} from 'story-utils/decorators';

import FormStep from '.';
import {
  getSubmissionStepDetail,
  mockSubmissionLogicCheckPost,
  mockSubmissionStepGet,
} from './mocks';

export default {
  title: 'Private API / FormStep',
  component: FormStep,
  decorators: [ConfigDecorator, withRouter, AnalyticsToolsDecorator],
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
      routePath: '/stap/:step',
      routeParams: {step: 'step-1'},
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
  onSessionDestroyed,
  onDestroySession,
  // story args
  formioConfiguration,
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
    mockSubmissionLogicCheckPost(submission, submissionStepDetailBody)
  );
  return (
    <FormStep
      form={form}
      submission={submission}
      onLogicChecked={onLogicChecked}
      onStepSubmitted={onStepSubmitted}
      onSessionDestroyed={onSessionDestroyed}
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

    const abortButton = await canvas.findByRole('button', {name: 'Abort submission'});
    await expect(abortButton).toBeVisible();
  },
};
