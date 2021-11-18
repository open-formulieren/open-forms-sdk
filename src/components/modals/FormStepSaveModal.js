/**
 * Display a modal to allow the user to save the form step in it's current state.
 */
import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';
import {useIntl, FormattedMessage} from 'react-intl';
import {useImmerReducer} from 'use-immer';

import {put, post, destroy} from 'api';
import { ConfigContext } from 'Context';
import Body from 'components/Body';
import Button from 'components/Button';
import ErrorMessage from 'components/ErrorMessage';
import HelpText from 'components/HelpText';
import Input from 'components/Input';
import Label from 'components/Label';
import Loader from 'components/Loader';
import Modal from 'components/modals/Modal';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {getBEMClassName} from 'utils';


const initialState = {
  email: '',
  errorMessage: '',
  isSaving: false,
};

const reducer = (draft, action) => {
  switch(action.type) {
    case 'SET_EMAIL': {
      draft.email = action.payload;
      break;
    }
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
    stepData,
    saveStepDataUrl,
    suspendFormUrl,
}) => {
  const history = useHistory();
  const intl = useIntl();
  const config = useContext(ConfigContext);

  const [
    {email, errorMessage, isSaving},
    dispatch
  ] = useImmerReducer(reducer, initialState);

  const onSubmit = async (event) => {
    event.preventDefault();

    dispatch({type: 'START_SAVE'});

    let response = await put(saveStepDataUrl, {data: stepData});
    if (!response.ok) {
      dispatch({
        type: 'API_ERROR',
        payload: {
          feedback: intl.formatMessage({
            description: "Modal saving data failed message",
            defaultMessage: "Saving the data failed, please try again later"
          }),
        },
      });
      return;
    }
    response = await post(suspendFormUrl, {email});
    if (!response.ok){
      dispatch({
        type: 'API_ERROR',
        payload: {
          feedback: intl.formatMessage({
            description: "Modal suspending form failed message",
            defaultMessage: "Suspending the form failed, please try again later"
          }),
        },
      });
      return;
    }
    try {
      // Destroy throws an exception if the API is not successful
      await destroy(`${config.baseUrl}authentication/session`);
    } catch (e) {
      dispatch({
        type: 'API_ERROR',
        payload: {
          feedback: intl.formatMessage({
            description: "Modal logging out failed message",
            defaultMessage: "Logging out failed, please try again later"
          }),
        },
      });
      return;
    }

    // redirect back to start page
    dispatch({type: 'SAVE_SUCCEEDED'});
    history.push('/');
  };

  return (
      <Modal
        title={<FormattedMessage
                  description="Form Save Modal Title"
                  defaultMessage="Form Save"
                />}
        isOpen={isOpen}
        closeModal={closeModal}
      >
        <Body component="form" onSubmit={onSubmit}>

          {isSaving ? <Loader modifiers={['centered']} /> : null}

          {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

          <Body modifiers={['big']}>
            <FormattedMessage
              description="Form save modal body text"
              defaultMessage="Enter your email address to get an email to resume the form at a later date"
            />
          </Body>

          <div className={getBEMClassName('form-control')}>

            <Label isRequired >
              <FormattedMessage
                description="Form save modal email field label"
                defaultMessage="Your email address" />
            </Label>

            <Input type="email" value={email} onChange={event => {
              dispatch({
                type: 'SET_EMAIL',
                payload: event.target.value
              });
            }} />

            <HelpText>
              <FormattedMessage
                description="Form save modal email field help text"
                defaultMessage="The email address where you will received the email about resuming the form."
              />
            </HelpText>

          </div>

          <Toolbar modifiers={['bottom', 'reverse']}>
            <ToolbarList>
              <Button type="submit" variant="primary" disabled={isSaving}>
                <FormattedMessage description="Form save modal submit button" defaultMessage="Save Form & Logout" />
              </Button>
            </ToolbarList>
          </Toolbar>

        </Body>
      </Modal>
  );
};

FormStepSaveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  stepData: PropTypes.object.isRequired,
  saveStepDataUrl: PropTypes.string.isRequired,
  suspendFormUrl: PropTypes.string.isRequired,
};

export default FormStepSaveModal;
