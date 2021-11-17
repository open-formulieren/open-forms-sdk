/**
 * Display a modal to allow the user to save the form step in it's current state.
 */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import {put, post, destroy} from 'api';
import Body from 'components/Body';
import ErrorMessage from 'components/ErrorMessage';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import Modal from 'components/modals/Modal';
import Input from 'components/Input';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import Button from 'components/Button';
import {getBEMClassName} from 'utils';


const FormStepSaveModal = ({
    isOpen,
    closeModal,
    stepData,
    saveStepDataUrl,
    suspendFormUrl,
    destroySessionUrl,
}) => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [failed, setFailed] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    let response = await put(saveStepDataUrl, {data: stepData});
    if (!response.ok) return setFailed(true);
    response = await post(suspendFormUrl, {email});
    if (!response.ok) return setFailed(true);
    try {
      // Destroy throws an exception if the API is not successful
      await destroy(destroySessionUrl);
    } catch (e) {
      return setFailed(true);
    }
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

          {
            failed
            ? (
              <ErrorMessage>
                <FormattedMessage
                  description="Form save modal error message"
                  defaultMessage="Saving form failed.  Please try again."
                />
              </ErrorMessage>
            )
            : null
          }

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

            <Input type="email" value={email} onChange={event => setEmail(event.target.value)} />

            <HelpText>
              <FormattedMessage
                description="Form save modal email field help text"
                defaultMessage="The email address where you will received the email about resuming the form."
              />
            </HelpText>

          </div>

          <Toolbar modifiers={['bottom', 'reverse']}>
            <ToolbarList>
              <Button type="submit" variant="primary">
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
  destroySessionUrl: PropTypes.string.isRequired,
};

export default FormStepSaveModal;
