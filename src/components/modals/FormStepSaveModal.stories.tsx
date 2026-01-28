import {PrimaryActionButton} from '@open-formulieren/formio-renderer';
import type {Decorator, Meta, StoryObj} from '@storybook/react-vite';
import {HttpResponse, http} from 'msw';
import {useArgs} from 'storybook/preview-api';
import {expect, fn, userEvent, waitFor, within} from 'storybook/test';

import {BASE_URL} from '@/api-mocks';

import type {FormStepSaveModalProps} from './FormStepSaveModal';
import FormStepSaveModal from './FormStepSaveModal';

const mockSuspendFormPOST = http.post(`${BASE_URL}submissions/:uuid/_suspend`, () =>
  HttpResponse.json({ok: true})
);

const mockSuspendFormPOSTError = http.post(`${BASE_URL}submissions/:uuid/_suspend`, () =>
  HttpResponse.json({}, {status: 400})
);

const mockDestroySessionDELETE = http.delete(
  `${BASE_URL}authentication/:uuid/session`,
  () => new HttpResponse(null, {status: 204})
);

const withTriggerDecorator: Decorator<FormStepSaveModalProps> = (Story, context) => {
  const [, updateArgs] = useArgs();
  return (
    <div style={{minHeight: 'calc(100dvh - 2 * 1rem)'}}>
      <PrimaryActionButton onClick={() => updateArgs({isOpen: true})}>
        Open Modal
      </PrimaryActionButton>
      <Story
        {...context}
        args={{
          ...context.args,
          closeModal: () => {
            context.args.closeModal();
            updateArgs({isOpen: false});
          },
          onSessionDestroyed: () => {
            context.args.onSessionDestroyed();
            updateArgs({isOpen: false});
          },
        }}
      />
    </div>
  );
};

export default {
  title: 'Private API / FormStepSaveModal',
  component: FormStepSaveModal,
  decorators: [withTriggerDecorator],
  args: {
    suspendFormUrl: `${BASE_URL}submissions/bb890fae-b0b1-4e61-a6a9-536edfc8a63f/_suspend`,
    onSessionDestroyed: fn(),
    onSaveConfirm: fn(),
    closeModal: fn(),
  },
  argTypes: {
    suspendFormUrl: {control: false},
  },
  parameters: {
    msw: {
      handlers: [mockSuspendFormPOST, mockDestroySessionDELETE],
    },
  },
} satisfies Meta<typeof FormStepSaveModal>;

type Story = StoryObj<typeof FormStepSaveModal>;

export const FormStepSaveModalStory: Story = {
  name: 'FormStepSaveModal',
  args: {
    isOpen: false,
    suspendFormUrlLifetime: 7,
  },
};

export const FormStepSaveModalWithErrors: Story = {
  args: {
    isOpen: false,
    suspendFormUrlLifetime: 7,
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // alternatively, set the arg `isOpen: true`
    const openModalButton = canvas.getByRole('button', {name: 'Open Modal'});
    expect(openModalButton).toBeVisible();
    await userEvent.click(openModalButton);

    const modal = await canvas.findByRole('dialog');
    const emailInput = within(modal).getByLabelText('Je e-mailadres');

    const submitButton = canvas.getByRole('button', {name: 'Later verdergaan'});

    await step('Test empty value', async () => {
      await userEvent.click(submitButton);
      const emptyErrorMessage = await within(modal).findByText('Je e-mailadres is verplicht.');
      expect(emptyErrorMessage).toBeVisible();
    });

    await step('Test invalid email address', async () => {
      await userEvent.type(emailInput, 'invalid');
      await userEvent.click(submitButton);
      const invalidErrorMessage = await within(modal).findByText(
        "Je e-mailadres moet een geldig e-mailadres zijn, zoals 'willem@example.com' bijvoorbeeld."
      );
      expect(invalidErrorMessage).toBeVisible();
    });
  },
};

export const FormStepSaveModalMultipleSubmits: Story = {
  args: {
    isOpen: false,
    suspendFormUrlLifetime: 7,
  },
  parameters: {
    msw: {
      handlers: [mockDestroySessionDELETE, mockSuspendFormPOSTError],
    },
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // alternatively, set the arg `isOpen: true`
    const openModalButton = canvas.getByRole('button', {name: 'Open Modal'});
    expect(openModalButton).toBeVisible();
    await userEvent.click(openModalButton);

    const modal = await canvas.findByRole('dialog');
    const emailInput = within(modal).getByLabelText('Je e-mailadres');
    const closeModalButton = within(modal).getByRole('button', {name: 'Sluiten'});

    const backendErrorMsg = 'Het pauzeren van het formulier is mislukt. Probeer het later opnieuw.';

    await step('Test backend error', async () => {
      await userEvent.type(emailInput, 'test@example.com');
      const submitButton = canvas.getByRole('button', {name: 'Later verdergaan'});
      await userEvent.click(submitButton);
      const backendErrorMessage = await within(modal).findByText(backendErrorMsg);
      expect(backendErrorMessage).toBeVisible();
    });

    // close the modal
    await userEvent.click(closeModalButton);
    await waitFor(() => {
      expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // re-open the modal and try to re-submit the form
    expect(openModalButton).toBeVisible();
    await userEvent.click(openModalButton);

    const modal2 = await canvas.findByRole('dialog');
    await waitFor(() => {
      expect(modal2).toBeVisible();
    });

    const emailInput2 = within(modal2).getByLabelText('Je e-mailadres');
    await waitFor(() => {
      expect(emailInput2).toBeVisible();
    });
    // make sure the previous backend error is not shown any more
    expect(within(modal2).queryByText(backendErrorMsg)).not.toBeInTheDocument();

    await step('Test we can re-submit the form', async () => {
      await userEvent.clear(emailInput2);
      const submitButton2 = canvas.getByRole('button', {name: 'Later verdergaan'});
      await userEvent.click(submitButton2);
      const invalidErrorMessage = await within(modal2).findByText('Je e-mailadres is verplicht.');
      expect(invalidErrorMessage).toBeVisible();
    });
  },
};
