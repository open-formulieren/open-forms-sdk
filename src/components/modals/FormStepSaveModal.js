/**
 * Display a modal to allow the user to save the form step in it's current state.
 */
import {Button as UtrechtButton} from '@utrecht/component-library-react';
import {Formik} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useImmerReducer} from 'use-immer';

import {post} from 'api';
import Body from 'components/Body';
import ErrorMessage from 'components/Errors/ErrorMessage';
import Loader from 'components/Loader';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {EmailField} from 'components/forms';
import Modal from 'components/modals/Modal';

const initialState = {
  errorMessage: '',
  isSaving: false,
};

const reducer = (draft, action) => {
  switch (action.type) {
    case 'START_SAVE': {
      draft.errorMessage = '';
      draft.isSaving = true;
      break;
    }
    case 'API_ERROR': {
      const {feedback} = action.payload;
      draft.errorMessage = feedback;
      draft.isSaving = false;
      break;
    }
    case 'SAVE_SUCCEEDED': {
      return initialState;
    }
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
};

const FormStepSaveModal = ({
  isOpen,
  closeModal,
  onSaveConfirm,
  onSessionDestroyed,
  suspendFormUrl,
  suspendFormUrlLifetime,
}) => {
  const intl = useIntl();

  const [{errorMessage, isSaving}, dispatch] = useImmerReducer(reducer, initialState);

  const onSubmit = async ({email}, actions) => {
    if (isSaving) return;

    dispatch({type: 'START_SAVE'});

    const saveResponse = await onSaveConfirm();
    if (!saveResponse.ok) {
      actions.setSubmitting(false);
      dispatch({
        type: 'API_ERROR',
        payload: {
          feedback: intl.formatMessage({
            description: 'Modal saving data failed message',
            defaultMessage: 'Saving the data failed, please try again later',
          }),
        },
      });
      return;
    }
    const suspendResponse = await post(suspendFormUrl, {email});
    if (!suspendResponse.ok) {
      actions.setSubmitting(false);
      dispatch({
        type: 'API_ERROR',
        payload: {
          feedback: intl.formatMessage({
            description: 'Modal suspending form failed message',
            defaultMessage: 'Suspending the form failed, please try again later',
          }),
        },
      });
      return;
    }

    actions.setSubmitting(false);
    dispatch({type: 'SAVE_SUCCEEDED'});

    onSessionDestroyed();
  };

  return (
    <Modal
      title={
        <FormattedMessage
          description="Form save modal title"
          defaultMessage="Save and resume later"
        />
      }
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <Formik initialValues={{email: ''}} onSubmit={onSubmit}>
        {props => (
          <Body component="form" onSubmit={props.handleSubmit}>
            {isSaving ? <Loader modifiers={['centered']} /> : null}

            {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

            <Body modifiers={['big']}>
              <FormattedMessage
                description="Form save modal body text"
                defaultMessage="Enter your email address to get an email to resume the form at a later date. This can be done on any device where you open the link. The link remains valid for {numberOfDays, plural, one {1 day} other {{numberOfDays} days}}."
                values={{numberOfDays: suspendFormUrlLifetime}}
              />
            </Body>
            <EmailField
              name="email"
              isRequired
              label={
                <FormattedMessage
                  description="Form save modal email field label"
                  defaultMessage="Your email address"
                />
              }
              description={
                <FormattedMessage
                  description="Form save modal email field help text"
                  defaultMessage="The email address where you will receive the resume link."
                />
              }
            />

            <Toolbar modifiers={['bottom', 'reverse']}>
              <ToolbarList>
                <UtrechtButton type="submit" appearance="primary-action-button" disabled={isSaving}>
                  <FormattedMessage
                    description="Form save modal submit button"
                    defaultMessage="Continue later"
                  />
                </UtrechtButton>
              </ToolbarList>
            </Toolbar>
          </Body>
        )}
      </Formik>
    </Modal>
  );
};

FormStepSaveModal.propTypes = {
  /**
   * Modal open/closed state.
   */
  isOpen: PropTypes.bool.isRequired,
  /**
   * Callback function to close the modal
   *
   * Invoked on ESC keypress or clicking the "X" to close the modal.
   */
  closeModal: PropTypes.func.isRequired,
  /**
   * Callback to execute when the submission session is destroyed, effectively logging
   * out the user.
   */
  onSessionDestroyed: PropTypes.func.isRequired,
  /**
   * Callback to persist the submission data to the backend.
   */
  onSaveConfirm: PropTypes.func.isRequired,
  /**
   * Backend API endpoint to suspend the submission.
   */
  suspendFormUrl: PropTypes.string.isRequired,
  /**
   * Duration that the resume URL is valid for, in days.
   */
  suspendFormUrlLifetime: PropTypes.number.isRequired,
};

export default FormStepSaveModal;
