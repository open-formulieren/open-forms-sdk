import {useArgs} from '@storybook/client-api';
import omit from 'lodash/omit';
import {withRouter} from 'storybook-addon-react-router-v6';

import {buildSubmission} from 'api-mocks';
import {SUBMISSION_ALLOWED} from 'components/constants';

import ProgressIndicator from '.';
import ProgressIndicatorDisplay from './ProgressIndicatorDisplay';

export default {
  title: 'Composites / ProgressIndicator',
  component: ProgressIndicator,
  decorators: [withRouter],
  argTypes: {
    submissionAllowed: {
      options: Object.values(SUBMISSION_ALLOWED),
      control: {type: 'radio'},
    },
    'submission.submissionAllowed': {
      options: Object.values(SUBMISSION_ALLOWED),
      control: {type: 'radio'},
    },
    submission: {table: {disable: true}},
  },
};

export const Display = {
  render: args => {
    const [_, updateArgs] = useArgs();
    return (
      <ProgressIndicatorDisplay
        onExpandClick={() => updateArgs({...args, expanded: !args.expanded})}
        {...args}
      />
    );
  },
  args: {
    activeStepTitle: 'Stap 2',
    formTitle: 'Storybookformulier',
    steps: [
      {
        uuid: '111',
        slug: 'stap1',
        formDefinition: 'Stap 1',
        isCompleted: true,
        isApplicable: true,
        isCurrent: false,
        canNavigateTo: true,
      },
      {
        uuid: '222',
        slug: 'stap2',
        formDefinition: 'Stap 2',
        isCompleted: false,
        isApplicable: true,
        isCurrent: true,
        canNavigateTo: true,
      },
      {
        uuid: '333',
        slug: 'stap3',
        formDefinition: 'Stap 3',
        isCompleted: false,
        isApplicable: false,
        isCurrent: false,
        canNavigateTo: false,
      },
    ],
    hasSubmission: true,
    isStartPage: false,
    isSummary: false,
    isConfirmation: false,
    isSubmissionComplete: false,
    areApplicableStepsCompleted: false,
    showOverview: true,
    showConfirmation: false,
    expanded: false,
  },
  argTypes: {
    title: {table: {disable: true}},
    'submission.submissionAllowed': {table: {disable: true}},
    submissionAllowed: {table: {disable: true}},
    completed: {table: {disable: true}},
  },
};

const render = ({
  title,
  submissionAllowed,
  completed,
  steps = [],
  hideNonApplicableSteps = false,
  withoutSubmission = false,
  ...args
}) => {
  const _submission = buildSubmission({
    submissionAllowed: args['submission.submissionAllowed'],
    steps,
    payment: {
      isRequired: false,
      hasPaid: false,
    },
  });
  return (
    <ProgressIndicator
      title={title}
      submission={withoutSubmission ? null : _submission}
      steps={_submission.steps.map(step => omit(step, ['completed', 'isApplicable']))}
      submissionAllowed={submissionAllowed}
      completed={completed}
      hideNonApplicableSteps={hideNonApplicableSteps}
    />
  );
};

export const ActiveSubmission = {
  name: 'Active submission',
  render,
  args: {
    // story args
    steps: [
      {
        url: 'https://backend/api/v1/form/9d49e773/steps/d6cab0dd',
        uuid: 'd6cab0dd',
        index: 0,
        slug: 'first-step',
        formDefinition: 'Stap 1',
        isApplicable: true,
        completed: true,
      },
      {
        url: 'https://backend/api/v1/form/9d49e773/steps/8e62d7cf',
        uuid: '8e62d7cf',
        index: 1,
        slug: 'second-step',
        formDefinition: 'Stap 2',
        isApplicable: false,
        completed: false,
      },
    ],
    'submission.submissionAllowed': SUBMISSION_ALLOWED.yes,
    // component props
    title: 'Storybookformulier',
    submissionAllowed: SUBMISSION_ALLOWED.yes,
    completed: false,
    hideNonApplicableSteps: false,
  },
  argTypes: {
    submissionAllowed: {table: {disable: true}},
  },
  parameters: {
    reactRouter: {
      routePath: '/stap/:step',
      routeParams: {step: 'first-step'},
    },
  },
};

export const InitialFormLoad = {
  name: 'Initial form load',
  render,
  args: {
    // story args
    steps: [
      {
        url: 'https://backend/api/v1/form/9d49e773/steps/d6cab0dd',
        uuid: 'd6cab0dd',
        index: 0,
        slug: 'first-step',
        formDefinition: 'Stap 1',
        isApplicable: true,
        completed: false,
      },
      {
        url: 'https://backend/api/v1/form/9d49e773/steps/8e62d7cf',
        uuid: '8e62d7cf',
        index: 1,
        slug: 'second-step',
        formDefinition: 'Stap 2',
        isApplicable: true,
        completed: false,
      },
    ],
    'submission.submissionAllowed': SUBMISSION_ALLOWED.yes,
    withoutSubmission: true,
    // component props
    title: 'Initial load',
    submissionAllowed: SUBMISSION_ALLOWED.yes,
    completed: false,
  },
  argTypes: {
    'submission.submissionAllowed': {table: {disable: true}},
    withoutSubmission: {table: {disable: true}},
    completed: {table: {disable: true}},
    hideNonApplicableSteps: {table: {disable: true}},
  },
  parameters: {
    reactRouter: {
      routePath: '/startpagina',
    },
  },
};
