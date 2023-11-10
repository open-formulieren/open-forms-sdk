import {withRouter} from 'storybook-addon-react-router-v6';

import {STEP_LABELS} from 'components/constants';

import ProgressIndicator from '.';

export default {
  title: 'Private API / ProgressIndicator',
  component: ProgressIndicator,
  decorators: [withRouter],
  args: {
    progressIndicatorTitle: 'Progress',
    formTitle: 'Formulier',
    steps: [
      {
        slug: 'start-page',
        to: 'start-page',
        formDefinition: 'Start page',
        isCompleted: true,
        isApplicable: true,
        isCurrent: false,
        canNavigateTo: true,
        fixedText: STEP_LABELS.login,
      },
      {
        uuid: 'd6cab0dd',
        slug: 'first-step',
        to: 'first-step',
        formDefinition: 'Stap 1',
        isCompleted: true,
        isApplicable: true,
        isCurrent: false,
        canNavigateTo: true,
      },
      {
        uuid: '8e62d7cf',
        slug: 'second-step',
        to: 'second-step',
        formDefinition: 'Stap 2',
        isCompleted: false,
        isApplicable: true,
        isCurrent: true,
        canNavigateTo: true,
      },
      {
        slug: 'confirmation-page',
        to: 'confirmation-page',
        formDefinition: 'Confirmation',
        isCompleted: false,
        isApplicable: false,
        isCurrent: false,
        canNavigateTo: true,
        fixedText: STEP_LABELS.confirmation,
      },
      {
        slug: 'summary-page',
        to: 'summary-page',
        formDefinition: 'Summary',
        isCompleted: false,
        isApplicable: false,
        isCurrent: false,
        canNavigateTo: true,
        fixedText: STEP_LABELS.overview,
      },
    ],
    ariaMobileIconLabel: 'Progress step indicator toggle icon (mobile)',
    accessibleToggleStepsLabel: 'Current step in form Formulier: Stap 2',
  },
};

export const Default = {};
