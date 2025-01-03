// eslint-disable-next-line import/named
import {useArgs} from '@storybook/preview-api';
import {expect, userEvent, within} from '@storybook/test';
import {HttpResponse, http} from 'msw';

import {BASE_URL} from 'api-mocks';
import {OFButton} from 'components/Button';
import {ConfigDecorator} from 'story-utils/decorators';

import {default as FormStepSaveModalComponent} from './FormStepSaveModal';

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

const Render = ({
  isOpen,
  closeModal,
  submissionId,
  suspendFormUrlLifetime,
  onSessionDestroyed,
  onSaveConfirm,
}) => {
  const [, updateArgs] = useArgs();
  return (
    <>
      <OFButton appearance="primary-action-button" onClick={() => updateArgs({isOpen: true})}>
        Open Modal
      </OFButton>
      <FormStepSaveModalComponent
        isOpen={isOpen}
        closeModal={() => {
          closeModal();
          updateArgs({isOpen: false});
        }}
        onSessionDestroyed={() => {
          onSessionDestroyed();
          updateArgs({isOpen: false});
        }}
        onSaveConfirm={() => {
          onSaveConfirm();
          return {ok: true};
        }}
        suspendFormUrl={`${BASE_URL}submissions/${submissionId}/_suspend`}
        submissionId={submissionId}
        suspendFormUrlLifetime={suspendFormUrlLifetime}
        parentSelector={() => document.getElementById('storybook-root')}
        ariaHideApp={false}
      />
    </>
  );
};

export default {
  title: 'Private API / FormStepSaveModal',
  component: FormStepSaveModalComponent,
  render: Render,
  decorators: [ConfigDecorator],
  parameters: {
    controls: {
      expanded: true,
    },
    msw: {
      handlers: [mockSuspendFormPOST, mockDestroySessionDELETE],
    },
  },
  argTypes: {
    suspendFormUrl: {control: false},
    onSessionDestroyed: {control: false, action: true},
    onSaveConfirm: {control: false, action: true},
    closeModal: {control: false, action: true},
  },
};

export const FormStepSaveModal = {
  args: {
    isOpen: false,
    submissionId: '05b5d1d6-cd5f-465b-a4b9-6f1078ffe9cc',
    suspendFormUrlLifetime: 7,
  },
};

export const FormStepSaveModalWithErrors = {
  args: {
    isOpen: false,
    submissionId: '05b5d1d6-cd5f-465b-a4b9-6f1078ffe9cc',
    suspendFormUrlLifetime: 7,
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // alternatively, set the arg `isOpen: true`
    const openModalButton = canvas.getByRole('button', {name: 'Open Modal'});
    await expect(openModalButton).toBeVisible();
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

export const FormStepSaveModalMultipleSubmits = {
  parameters: {
    controls: {
      expanded: true,
    },
    msw: {
      handlers: [mockDestroySessionDELETE, mockSuspendFormPOSTError],
    },
  },
  args: {
    isOpen: false,
    submissionId: '05b5d1d6-cd5f-465b-a4b9-6f1078ffe9cc',
    suspendFormUrlLifetime: 7,
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // alternatively, set the arg `isOpen: true`
    const openModalButton = canvas.getByRole('button', {name: 'Open Modal'});
    await expect(openModalButton).toBeVisible();
    await userEvent.click(openModalButton);

    const modal = await canvas.findByRole('dialog');
    const emailInput = within(modal).getByLabelText('Je e-mailadres');

    const backendErrorMsg = 'Het pauzeren van het formulier is mislukt. Probeer het later opnieuw.';

    await step('Test backend error', async () => {
      await userEvent.type(emailInput, 'test@example.com');
      const submitButton = canvas.getByRole('button', {name: 'Later verdergaan', type: 'submit'});
      await userEvent.click(submitButton);
      const backendErrorMessage = await within(modal).findByText(backendErrorMsg);
      expect(backendErrorMessage).toBeVisible();
    });

    // close the modal
    const closeModalButton = document.querySelector('.openforms-react-modal__close');
    await userEvent.click(closeModalButton);

    // re-open the modal and try to re-submit the form
    await expect(openModalButton).toBeVisible();
    await userEvent.click(openModalButton);

    const modal2 = await canvas.findByRole('dialog');
    const emailInput2 = within(modal2).getByLabelText('Je e-mailadres');

    // make sure the previous backend error is not shown any more
    expect(within(modal2).queryByText(backendErrorMsg)).not.toBeInTheDocument();

    await step('Test we can re-submit the form', async () => {
      expect(emailInput2).toHaveDisplayValue('');
      const submitButton2 = canvas.getByRole('button', {name: 'Later verdergaan', type: 'submit'});
      await userEvent.click(submitButton2);
      const invalidErrorMessage = await within(modal2).findByText('Je e-mailadres is verplicht.');
      expect(invalidErrorMessage).toBeVisible();
    });
  },
};
