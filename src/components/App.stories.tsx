import type {Decorator, Meta, StoryObj} from '@storybook/react-vite';
import {useEffect} from 'react';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {expect, fn, userEvent, waitForElementToBeRemoved, within} from 'storybook/test';

import {FormContext} from '@/Context';
import {
  BASE_URL,
  buildForm,
  mockAnalyticsToolConfigGet,
  mockCustomStaticTranslationsGet,
} from '@/api-mocks';
import {
  mockSubmissionCheckLogicPost,
  mockSubmissionGet,
  mockSubmissionPost,
  mockSubmissionStepGet,
} from '@/api-mocks/submissions';
import {
  mockFormioTranslations,
  mockLanguageChoicePut,
  mockLanguageInfoGet,
} from '@/components/LanguageSelection/mocks';
import type {Form, MinimalFormStep} from '@/data/forms';
import type {Submission} from '@/data/submissions';
import {I18NManager, setLanguage} from '@/i18n';
import routes, {FUTURE_FLAGS} from '@/routes';
import {withNuqs, withPageWrapper} from '@/sb-decorators';

import App from './App';

interface WrapperProps {
  form: Form;
  showExternalHeader: boolean;
}

const Wrapper: React.FC<WrapperProps> = ({form, showExternalHeader}) => {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
    initialIndex: 0,
    future: FUTURE_FLAGS,
  });
  return (
    <FormContext.Provider value={form}>
      {showExternalHeader && (
        <header style={{padding: '10px', textAlign: 'center'}}>External header</header>
      )}
      <RouterProvider router={router} />
    </FormContext.Provider>
  );
};

interface Args {
  name: string;
  'form.translationEnabled': boolean;
  submissionAllowed: Form['submissionAllowed'];
  hideNonApplicableSteps: boolean;
  'form.submissionLimitReached': boolean;
  steps: MinimalFormStep[];
  showExternalHeader: boolean;
}

const ResetTranslations: Decorator<Args> = Story => {
  useEffect(() => {
    return () => {
      setLanguage('nl');
    };
  });
  return <Story />;
};

export default {
  title: 'Private API / App',
  component: App,
  render: args => {
    const form = buildForm({
      name: args.name,
      translationEnabled: args['form.translationEnabled'],
      explanationTemplate: '<p>Toelichtingssjabloon...</p>',
      submissionAllowed: args['submissionAllowed'],
      hideNonApplicableSteps: args['hideNonApplicableSteps'],
      submissionLimitReached: args['form.submissionLimitReached'],
      steps: args['steps'],
    });
    return <Wrapper form={form} showExternalHeader={args.showExternalHeader} />;
  },
  args: {
    name: 'Mock form',
    'form.translationEnabled': true,
    submissionAllowed: 'yes',
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
      },
      {
        uuid: '98980oi8-e5a4-4abf-b64a-76j3j3ki897',
        slug: 'step-2',
        formDefinition: 'Step 2',
        index: 1,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/98980oi8-e5a4-4abf-b64a-76j3j3ki897`,
        isApplicable: false,
      },
    ],
    showExternalHeader: false,
  },
  argTypes: {
    submissionAllowed: {
      options: [
        'yes',
        'no_with_overview',
        'no_without_overview',
      ] satisfies Submission['submissionAllowed'][],
      control: {type: 'radio'},
      'submission.submissionAllowed': {
        options: [
          'yes',
          'no_with_overview',
          'no_without_overview',
        ] satisfies Submission['submissionAllowed'][],
        control: {type: 'radio'},
      },
    },
  },
  parameters: {
    msw: {
      handlers: [
        mockLanguageInfoGet([
          {code: 'nl', name: 'Nederlands'},
          {code: 'en', name: 'English'},
        ]),
        mockLanguageChoicePut,
        mockAnalyticsToolConfigGet(),
      ],
    },
  },
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const Default: Story = {
  decorators: [withNuqs, withPageWrapper],
};

export const TranslationEnabled: Story = {
  ...Default,
  args: {
    'form.translationEnabled': true,
  },
  play: async ({canvasElement}) => {
    const langSelector = await within(canvasElement).findByText(/^nl$/i);
    await expect(langSelector).toBeTruthy();
  },
};

export const TranslationDisabled: Story = {
  ...Default,
  args: {
    'form.translationEnabled': false,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // wait for spinners to disappear
    const spinners = document.querySelectorAll('.openforms-loading-indicator__spinner');
    await Promise.all(Array.from(spinners).map(spinner => waitForElementToBeRemoved(spinner)));

    // assert there's no NL button
    const langSelector = canvas.queryByText(/^nl$/i);
    await expect(langSelector).toBeNull();
  },
};

export const WithCustomNLTranslations: Story = {
  ...Default,
  decorators: [ResetTranslations, withPageWrapper, withNuqs],
  render: args => {
    const form = buildForm({
      name: args.name,
      translationEnabled: true,
      explanationTemplate: '<p>Toelichtingssjabloon...</p>',
      submissionAllowed: args['submissionAllowed'],
      hideNonApplicableSteps: args['hideNonApplicableSteps'],
      submissionLimitReached: args['form.submissionLimitReached'],
      steps: args['steps'],
    });
    return (
      <I18NManager languageSelectorTarget={null} onLanguageChangeDone={fn()}>
        <Wrapper form={form} showExternalHeader={args.showExternalHeader} />
      </I18NManager>
    );
  },
  parameters: {
    msw: {
      handlers: [
        mockCustomStaticTranslationsGet('en'),
        mockCustomStaticTranslationsGet('nl'),
        mockFormioTranslations,
        mockLanguageInfoGet([
          {code: 'nl', name: 'Nederlands'},
          {code: 'en', name: 'English'},
        ]),
        mockAnalyticsToolConfigGet(),
      ],
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    setLanguage('nl');

    expect(
      await canvas.findByText('Aangepaste vertaling (nl) voor startpagina')
    ).toBeInTheDocument();
  },
};

export const WithCustomENTranslations: Story = {
  ...Default,
  decorators: [ResetTranslations, withPageWrapper, withNuqs],
  render: args => {
    const form = buildForm({
      name: args.name,
      translationEnabled: true,
      explanationTemplate: '<p>Toelichtingssjabloon...</p>',
      submissionAllowed: args['submissionAllowed'],
      hideNonApplicableSteps: args['hideNonApplicableSteps'],
      submissionLimitReached: args['form.submissionLimitReached'],
      steps: args['steps'],
    });
    return (
      <I18NManager languageSelectorTarget={null} onLanguageChangeDone={fn()}>
        <Wrapper form={form} showExternalHeader={args.showExternalHeader} />
      </I18NManager>
    );
  },
  parameters: {
    msw: {
      handlers: [
        mockCustomStaticTranslationsGet('en'),
        mockCustomStaticTranslationsGet('nl'),
        mockFormioTranslations,
        mockLanguageInfoGet([
          {code: 'nl', name: 'Nederlands'},
          {code: 'en', name: 'English'},
        ]),
        mockAnalyticsToolConfigGet(),
      ],
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    setLanguage('en');

    expect(await canvas.findByText('Custom translation (en) for Start page')).toBeInTheDocument();
  },
};

export const ActiveSubmission: Story = {
  ...Default,
  name: 'Active submission',
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
        mockAnalyticsToolConfigGet(),
      ],
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const beginButton = await canvas.findByRole('button', {name: 'Begin'});
    await userEvent.click(beginButton);
  },
};

export const NonApplicableStepActiveSubmission: Story = {
  ...Default,
  name: 'Active submission with non-applicable step hidden',
  args: {
    hideNonApplicableSteps: true,
  },
  argTypes: {
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
        mockAnalyticsToolConfigGet(),
      ],
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const beginButton = await canvas.findByRole('button', {name: 'Begin'});
    await userEvent.click(beginButton);
  },
};

export const SeveralStepsInMobileViewport: Story = {
  decorators: [withNuqs],
  args: {
    showExternalHeader: true,
    name: 'A rather long form name that overflows on mobile',
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
        uuid: '4d4767b6-a3a4-4519-a1d3-f81e15bf829c',
        slug: 'step-9',
        formDefinition: 'Step 9',
        index: 8,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/4d4767b6-a3a4-4519-a1d3-f81e15bf829c`,
        isApplicable: true,
      },
      {
        uuid: '9166d9b7-baa9-429a-a19e-c0c88f2fdaa8',
        slug: 'step-10',
        formDefinition: 'Step 10',
        index: 9,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/9166d9b7-baa9-429a-a19e-c0c88f2fdaa8`,
        isApplicable: true,
      },
      {
        uuid: 'c5eb8263-39e7-4e8c-a6f4-77278f50ee52',
        slug: 'step-11',
        formDefinition: 'Step 11',
        index: 10,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/c5eb8263-39e7-4e8c-a6f4-77278f50ee52`,
        isApplicable: true,
      },
      {
        uuid: '4f79f369-7aca-4346-9d91-5d5e628b7fb0',
        slug: 'step-12',
        formDefinition: 'Step 12',
        index: 11,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/4f79f369-7aca-4346-9d91-5d5e628b7fb0`,
        isApplicable: true,
      },
    ],
  },
  parameters: {
    layout: 'fullscreen', // removes padding in canvas
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MaximumSubmissionsReached: Story = {
  decorators: [withPageWrapper, withNuqs],
  args: {
    'form.submissionLimitReached': true,
  },
};

export const MaximumSubmissionsNotReached: Story = {
  decorators: [withPageWrapper, withNuqs],
  args: {
    'form.submissionLimitReached': false,
  },
};
