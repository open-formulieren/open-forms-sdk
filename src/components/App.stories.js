import {expect} from '@storybook/jest';
import {userEvent, waitForElementToBeRemoved, within} from '@storybook/testing-library';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {FormContext} from 'Context';
import {BASE_URL} from 'api-mocks';
import {buildForm} from 'api-mocks';
import {
  mockSubmissionCheckLogicPost,
  mockSubmissionGet,
  mockSubmissionPost,
  mockSubmissionStepGet,
} from 'api-mocks/submissions';
import {mockLanguageChoicePut, mockLanguageInfoGet} from 'components/LanguageSelection/mocks';
import {ConfigDecorator, LayoutDecorator} from 'story-utils/decorators';

import App, {routes as nestedRoutes} from './App';
import {SUBMISSION_ALLOWED} from './constants';

export default {
  title: 'Private API / App',
  component: App,
  decorators: [ConfigDecorator],
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
    config: {
      debug: false,
    },
    msw: {
      handlers: [
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
      element: <App />,
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
  decorators: [LayoutDecorator],
};

export const TranslationEnabled = {
  ...Default,
  args: {
    'form.translationEnabled': true,
  },
  play: async ({canvasElement}) => {
    const langSelector = await within(canvasElement).findByText(/^nl$/i);
    await expect(langSelector).toBeTruthy();
  },
};

export const TranslationDisabled = {
  ...Default,
  args: {
    'form.translationEnabled': false,
  },
  play: async ({canvasElement}) => {
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
  ...Default,
  name: 'Active submission',
  decorators: [
    ...Default.decorators,
    // remove the window.localStorage entry, UUID value is from `api-mocks/forms.js`.
    // it gets set because of the play function which starts a submission.
    Story => {
      const key = 'e450890a-4166-410e-8d64-0a54ad30ba01';
      window.localStorage.removeItem(key);
      return <Story />;
    },
  ],
  args: {
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
    ],
  },
  argTypes: {
    hideNonApplicableSteps: {table: {disable: true}},
    submissionAllowed: {table: {disable: true}},
  },
  parameters: {
    msw: {
      handlers: [
        mockSubmissionPost(),
        mockSubmissionGet(),
        mockSubmissionStepGet(),
        mockSubmissionCheckLogicPost(),
        mockLanguageInfoGet([
          {code: 'nl', name: 'Nederlands'},
          {code: 'en', name: 'English'},
        ]),
        mockLanguageChoicePut,
      ],
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const beginButton = await canvas.findByRole('button', {name: 'Begin'});
    await userEvent.click(beginButton);
  },
};

export const SeveralStepsInMobileViewport = {
  render,
  args: {
    title: 'Progress',
    formTitle: 'Formulier',
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
      },
      {
        uuid: '71fa50c1-53db-4179-9fe7-eb3378ef39ee',
        slug: 'step-2',
        formDefinition: 'Step 2',
        index: 1,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/71fa50c1-53db-4179-9fe7-eb3378ef39ee`,
        isApplicable: true,
      },
      {
        uuid: 'f4f82113-ac83-429b-a17b-c1b145831fa9',
        slug: 'step-3',
        formDefinition: 'Step 3',
        index: 2,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/f4f82113-ac83-429b-a17b-c1b145831fa9`,
        isApplicable: true,
      },
      {
        uuid: 'ae5af44e-004f-4d2f-be75-d46a22577244',
        slug: 'step-4',
        formDefinition: 'Step 4',
        index: 3,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/ae5af44e-004f-4d2f-be75-d46a22577244`,
        isApplicable: true,
      },
      {
        uuid: 'cae11cf8-2773-4d70-80f4-71e5828b6fe3',
        slug: 'step-5',
        formDefinition: 'Step 5',
        index: 4,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/cae11cf8-2773-4d70-80f4-71e5828b6fe3`,
        isApplicable: true,
      },
      {
        uuid: '3b14f4f5-2283-4a81-adf1-03848672c83b',
        slug: 'step-6',
        formDefinition: 'Step 6',
        index: 5,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/3b14f4f5-2283-4a81-adf1-03848672c83b`,
        isApplicable: true,
      },
      {
        uuid: '3f0a2763-74de-4957-b970-a5117f15b023',
        slug: 'step-7',
        formDefinition: 'Step 7',
        index: 6,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/3f0a2763-74de-4957-b970-a5117f15b023`,
        isApplicable: true,
      },
      {
        uuid: '03657dc1-6bb1-49cf-8113-4b663981b70f',
        slug: 'step-8',
        formDefinition: 'Step 8',
        index: 7,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/03657dc1-6bb1-49cf-8113-4b663981b70f`,
        isApplicable: true,
      },
      {
        uuid: '03657dc1-6bb1-49cf-8113-4b663981b70f',
        slug: 'step-9',
        formDefinition: 'Step 9',
        index: 8,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/03657dc1-6bb1-49cf-8113-4b663981b70f`,
        isApplicable: true,
      },
      {
        uuid: '03657dc1-6bb1-49cf-8113-4b663981b70f',
        slug: 'step-10',
        formDefinition: 'Step 10',
        index: 9,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/03657dc1-6bb1-49cf-8113-4b663981b70f`,
        isApplicable: true,
      },
    ],
    ariaMobileIconLabel: 'Progress step indicator toggle icon (mobile)',
    accessibleToggleStepsLabel: 'Current step in form Formulier: Stap 2',
  },
  parameters: {
    chromatic: {disableSnapshot: true}, // TODO: set up viewports in chromatic
    layout: 'fullscreen', // removes padding in canvas
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
