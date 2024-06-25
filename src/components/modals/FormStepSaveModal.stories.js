import {useArgs} from '@storybook/preview-api';
import {expect, userEvent, within} from '@storybook/test';
import {rest} from 'msw';
import React from 'react';

import {BASE_URL} from 'api-mocks';
import {OFButton} from 'components/Button';
import {ConfigDecorator} from 'story-utils/decorators';

import {default as FormStepSaveModalComponent} from './FormStepSaveModal';

const mockSuspendFormPOST = rest.post(`${BASE_URL}submissions/:uuid/_suspend`, (req, res, ctx) =>
  res(ctx.json({ok: true}))
);

const mockSuspendFormPOSTError = rest.post(
  `${BASE_URL}submissions/:uuid/_suspend`,
  (req, res, ctx) => res(ctx.status(400))
);

const mockDestroySessionDELETE = rest.delete(
  `${BASE_URL}authentication/:uuid/session`,
  (req, res, ctx) => res(ctx.status(204))
);

export default {
  title: 'Private API / FormStepSaveModal',
  component: FormStepSaveModalComponent,
  decorators: [ConfigDecorator], // DeprecatedRouterDecorator],
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

const render = ({
  isOpen,
  closeModal,
  submissionId,
  suspendFormUrlLifetime,
  onSessionDestroyed,
  onSaveConfirm,
}) => {
  const [_, updateArgs] = useArgs();
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

export const FormStepSaveModal = {
  render,
  args: {
    isOpen: false,
    submissionId: '05b5d1d6-cd5f-465b-a4b9-6f1078ffe9cc',
    suspendFormUrlLifetime: 7,
  },
};

export const FormStepSaveModalWithErrors = {
  render,
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
    const emailInput = await within(modal).getByText('Email address');

    await step('Test empty value', async () => {
      const submitButton = canvas.getByRole('button', {name: 'Later verdergaan'});
      await userEvent.click(submitButton);
      const emptyErrorMessage = await within(modal).findByText('Email address is verplicht.');
      expect(emptyErrorMessage).toBeVisible();
    });

    await step('Test invalid email address', async () => {
      await userEvent.type(emailInput, 'invalid');
      const invalidErrorMessage = await within(modal).findByText('Invalid email');
      expect(invalidErrorMessage).toBeVisible();
    });
  },
};

export const FormStepSaveModalMultipleSubmits = {
  render,
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
    const emailInput = await within(modal).getByText('Email address');

    await step('Test backend error', async () => {
      await userEvent.type(emailInput, 'test@example.com');
      const submitButton = canvas.getByRole('button', {name: 'Later verdergaan', type: 'submit'});
      await userEvent.click(submitButton);
      const backendErrorMessage = await within(modal).findByText(
        'Het pauzeren van het formulier is mislukt. Probeer het later opnieuw.'
      );
      expect(backendErrorMessage).toBeVisible();
    });

    // close the modal
    const closeModalButton = document.querySelector('.openforms-react-modal__close');
    await userEvent.click(closeModalButton);

    // re-open the modal and try to re-submit the form
    const openModalButton2 = canvas.getByRole('button', {name: 'Open Modal'});
    await expect(openModalButton2).toBeVisible();
    await userEvent.click(openModalButton2);

    const modal2 = await canvas.findByRole('dialog');
    const emailInput2 = await within(modal2).getByText('Email address');

    await step('Test we can re-submit the form', async () => {
      await userEvent.type(emailInput2, 'invalid');
      const submitButton2 = canvas.getByRole('button', {name: 'Later verdergaan', type: 'submit'});
      await userEvent.click(submitButton2);
      const invalidErrorMessage = await within(modal2).findByText('Invalid email');
      expect(invalidErrorMessage).toBeVisible();
    });

    // make sure the previous backend error is not shown any more
    expect(
      within(modal2).queryByText(
        'Het pauzeren van het formulier is mislukt. Probeer het later opnieuw.'
      )
    ).not.toBeInTheDocument();
  },
};
