import {expect} from '@storybook/jest';
import {userEvent, waitFor, waitForElementToBeRemoved, within} from '@storybook/testing-library';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {FormContext} from 'Context';
import {BASE_URL} from 'api-mocks';
import {buildForm} from 'api-mocks';
import {mockSubmissionGet, mockSubmissionPost} from 'api-mocks/submissions';
import {mockLanguageChoicePut, mockLanguageInfoGet} from 'components/LanguageSelection/mocks';
import {ConfigDecorator, LayoutDecorator} from 'story-utils/decorators';

import App, {routes as nestedRoutes} from './App';
import {SUBMISSION_ALLOWED} from './constants';

export default {
  title: 'Private API / App',
  component: App,
  decorators: [LayoutDecorator, ConfigDecorator],
  args: {
    'form.translationEnabled': true,
    submissionAllowed: SUBMISSION_ALLOWED.yes,
    hideNonApplicableSteps: false,
    steps: [
      {
        uuid: '9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5',
        slug: 'step-1',
        formDefinition: 'Step 1',
        index: 0,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5`,
        isApplicable: true,
        completed: false,
      },
      {
        uuid: '98980oi8-e5a4-4abf-b64a-76j3j3ki897',
        slug: 'step-2',
        formDefinition: 'Step 2',
        index: 0,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/98980oi8-e5a4-4abf-b64a-76j3j3ki897`,
        isApplicable: false,
        completed: false,
      },
    ],
  },
  argTypes: {
    form: {table: {disable: true}},
    noDebug: {table: {disable: true}},
    submissionAllowed: {
      options: Object.values(SUBMISSION_ALLOWED),
      control: {type: 'radio'},
      'submission.submissionAllowed': {
        options: Object.values(SUBMISSION_ALLOWED),
        control: {type: 'radio'},
      },
    },
  },
  parameters: {
    msw: {
      handlers: [
        mockSubmissionGet(),
        mockSubmissionPost(),
        mockLanguageInfoGet([
          {code: 'nl', name: 'Nederlands'},
          {code: 'en', name: 'English'},
        ]),
        mockLanguageChoicePut,
      ],
    },
  },
};

const Wrapper = ({form}) => {
  const routes = [
    {
      path: '*',
      element: <App noDebug />,
      children: nestedRoutes,
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
    initialIndex: 0,
  });
  return (
    <FormContext.Provider value={form}>
      <RouterProvider router={router} />
    </FormContext.Provider>
  );
};

const render = args => {
  const form = buildForm({
    translationEnabled: args['form.translationEnabled'],
    explanationTemplate: '<p>Toelichtingssjabloon...</p>',
    submissionAllowed: args['submissionAllowed'],
    hideNonApplicableSteps: args['hideNonApplicableSteps'],
    steps: args['steps'],
  });
  return <Wrapper form={form} />;
};

export const Default = {
  render,
};

export const TranslationEnabled = {
  render,
  args: {
    'form.translationEnabled': true,
  },
  play: async ({args, canvasElement}) => {
    const langSelector = await within(canvasElement).findByText(/^nl$/i);
    await expect(langSelector).toBeTruthy();
  },
};

export const TranslationDisabled = {
  render,
  args: {
    'form.translationEnabled': false,
  },
  play: async ({args, canvasElement}) => {
    const canvas = within(canvasElement);

    // wait for spinners to disappear
    const spinners = document.querySelectorAll('.openforms-loading__spinner');
    await Promise.all(Array.from(spinners).map(waitForElementToBeRemoved));

    // assert there's no NL button
    const langSelector = canvas.queryByText(/^nl$/i);
    await expect(langSelector).toBeNull();
  },
};

export const ActiveSubmission = {
  name: 'Active submission',
  render,
  argTypes: {
    hideNonApplicableSteps: {table: {disable: true}},
    submissionAllowed: {table: {disable: true}},
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await waitFor(async () => {
      const beginButton = canvas.getByRole('button', {name: 'Begin'});
      await userEvent.click(beginButton);
    });
  },
};
