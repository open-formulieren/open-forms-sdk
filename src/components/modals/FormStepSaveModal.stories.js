import {useArgs} from '@storybook/preview-api';
import {rest} from 'msw';
import React from 'react';

import {BASE_URL} from 'api-mocks';
import {OFButton} from 'components/Button';
import {ConfigDecorator} from 'story-utils/decorators';

import {default as FormStepSaveModalComponent} from './FormStepSaveModal';

const mockSuspendFormPOST = rest.post(`${BASE_URL}submissions/:uuid/_suspend`, (req, res, ctx) =>
  res(ctx.json({ok: true}))
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

export const FormStepSaveModal = {
  render: ({
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
        />
      </>
    );
  },
  args: {
    isOpen: false,
    submissionId: '05b5d1d6-cd5f-465b-a4b9-6f1078ffe9cc',
    suspendFormUrlLifetime: 7,
  },
};
