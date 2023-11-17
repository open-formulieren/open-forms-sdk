import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport';
import {expect} from '@storybook/jest';
import {userEvent, waitFor, within} from '@storybook/testing-library';
import {withRouter} from 'storybook-addon-react-router-v6';

import ProgressIndicator from '.';

export default {
  title: 'Private API / ProgressIndicator',
  component: ProgressIndicator,
  decorators: [withRouter],
  args: {
    title: 'Progress',
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
        slug: 'summary-page',
        to: 'summary-page',
        formDefinition: 'Summary',
        isCompleted: false,
        isApplicable: true,
        isCurrent: false,
        canNavigateTo: false,
      },
      {
        slug: 'confirmation-page',
        to: 'confirmation-page',
        formDefinition: 'Confirmation',
        isCompleted: false,
        isApplicable: true,
        isCurrent: false,
        canNavigateTo: false,
      },
    ],
    ariaMobileIconLabel: 'Progress step indicator toggle icon (mobile)',
    accessibleToggleStepsLabel: 'Current step in form Formulier: Stap 2',
  },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'desktop',
    },
  },
};

export const Default = {};

export const MobileViewport = {
  name: 'Mobile version',
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await waitFor(async () => {
      const toggleButton = canvas.getByRole('button');
      await waitFor(() => expect(toggleButton).toHaveAttribute('aria-pressed', 'false'));
      await userEvent.click(toggleButton);
    });
  },
};
