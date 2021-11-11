/**
 * Render a single form step, as part of a started submission for a form.
 */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modals/Modal';
import ErrorMessage from "../ErrorMessage";
import {FormattedMessage} from "react-intl";
import Body from "../Body";
import ValidationErrors from "../ValidationErrors";
import Label from "../Label";
import Input from "../Input";
import HelpText from "../HelpText";
import {Toolbar, ToolbarList} from "../Toolbar";
import Button from "../Button";
import classNames from "classnames";
import {getBEMClassName} from "../../utils";

const FormSaveModal = ({
    isOpen,
    closeModal
}) => {

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState([]);
  const [failed, setFailed] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log('onSubmit called');
    setFailed(true);
  };

  const componentClassName = classNames(
    getBEMClassName('form-control'),
    {'formio-error-wrapper': errors.length > 0},
  );

  return (
      <Modal
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
                  defaultMessage="Saving form failed"
                />
              </ErrorMessage>
            )
            : null
          }

          <Body modifiers={['big']}>
            <FormattedMessage
              description="Form save modal body text"
              defaultMessage={"Enter your email address to get a email to resume the form at a later date"}
            />
          </Body>

          <div className={componentClassName}>

            <ValidationErrors errors={errors} />

            <Label isRequired >
              <FormattedMessage
                description="Form save modal email field label"
                defaultMessage="Your email address" />
            </Label>

            <Input type="email" value={email} onChange={event => {
              setEmail(event.target.value);
              setErrors([]);
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
              <Button type="submit" variant="primary">
                <FormattedMessage description="Form save modal submit button" defaultMessage="Save Form" />
              </Button>
            </ToolbarList>
          </Toolbar>

        </Body>
      </Modal>
  );
};

FormSaveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default FormSaveModal;
