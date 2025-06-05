import {TextField} from '@open-formulieren/formio-renderer';
import {ButtonGroup} from '@utrecht/button-group-react';
import {subDays, subYears} from 'date-fns';
import {Formik} from 'formik';
import PropTypes from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import Body from 'components/Body';
import ErrorMessage from 'components/Errors/ErrorMessage';
import {DateField} from 'components/forms';

import EnterPartnerButton from './EnterPartnerButton';
import getValidationSchema from './validationSchema';

const AddPartnerForm = ({partner, onSave, closeModal}) => {
  const intl = useIntl();

  const today = new Date();
  const maxDateOfBirth = subDays(today, 1);
  const minDateOfBirth = subYears(today, 120);

  const onSubmit = async values => {
    if (onSave) {
      onSave(values);
      closeModal();
    }
  };

  return (
    <Formik
      initialValues={
        partner ?? {
          bsn: '',
          initials: '',
          affixes: '',
          lastName: '',
          dateOfBirth: '',
        }
      }
      validationSchema={toFormikValidationSchema(getValidationSchema(intl))}
      onSubmit={onSubmit}
    >
      {({handleSubmit, values, setFieldValue}) => (
        <Body component="form" onSubmit={handleSubmit}>
          {!values ? (
            <ErrorMessage level="warning">
              <FormattedMessage
                description="Add partner modal: warning that no data is added"
                defaultMessage="You haven't entered any data yet."
              />
            </ErrorMessage>
          ) : (
            <div className="openforms-form-field-container">
              <TextField
                name="bsn"
                isRequired
                label={
                  <FormattedMessage description="Label for partners BSN" defaultMessage="BSN" />
                }
                onChange={event => {
                  setFieldValue('bsn', event.target.value);
                }}
              />
              <TextField
                name="initials"
                label={
                  <FormattedMessage
                    description="Label for partners initials"
                    defaultMessage="Initials"
                  />
                }
                onChange={event => {
                  setFieldValue('initials', event.target.value);
                }}
              />
              <TextField
                name="affixes"
                label={
                  <FormattedMessage
                    description="Label for partners affixes"
                    defaultMessage="Affixes"
                  />
                }
                onChange={event => {
                  setFieldValue('affixes', event.target.value);
                }}
              />
              <TextField
                name="lastName"
                isRequired
                label={
                  <FormattedMessage
                    description="Label for partners lastName"
                    defaultMessage="Lastname"
                  />
                }
                onChange={event => {
                  setFieldValue('lastName', event.target.value);
                }}
              />
              <DateField
                name="dateOfBirth"
                widget="datepicker"
                isRequired
                label={
                  <FormattedMessage
                    description="Label for partners dateOfBirth"
                    defaultMessage="Date of birth"
                  />
                }
                minDate={minDateOfBirth}
                maxDate={maxDateOfBirth}
                onChange={event => {
                  setFieldValue('dateOfBirth', event.target.value);
                }}
              />
            </div>
          )}

          <ButtonGroup direction="column" className="openforms-form-navigation">
            <EnterPartnerButton />
          </ButtonGroup>
        </Body>
      )}
    </Formik>
  );
};

AddPartnerForm.propTypes = {
  partner: PropTypes.shape({
    bsn: PropTypes.string,
    initials: PropTypes.string,
    affixes: PropTypes.string,
    lastName: PropTypes.string,
    dateOfBirth: PropTypes.string,
  }),
  onSave: PropTypes.func,
  closeModal: PropTypes.func,
};

export default AddPartnerForm;
