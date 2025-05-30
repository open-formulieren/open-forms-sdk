import {TextField} from '@open-formulieren/formio-renderer';
import {ButtonGroup} from '@utrecht/button-group-react';
import {Formik} from 'formik';
import PropTypes from 'prop-types';
import {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import Body from 'components/Body';
import {ErrorDisplay} from 'components/Errors';
import ErrorMessage from 'components/Errors/ErrorMessage';

import EnterPartnerButton from './EnterPartnerButton';

const getValidationSchema = intl =>
  z.object({
    bsn: z
      .string()
      .length(
        9,
        intl.formatMessage({
          description: 'Validation error describing shape of BSN.',
          defaultMessage: 'A BSN must be 9 digits',
        })
      )
      .regex(
        /[0-9]{9}/,
        intl.formatMessage({
          description: 'Validation error message for BSN pattern',
          defaultMessage: 'The BSN may only contain numbers (0-9).',
        })
      ),
  });

const AddPartnerForm = ({partner, componentKey, onSave, closeModal}) => {
  const intl = useIntl();
  const [error, setError] = useState(null);

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
      {({handleSubmit, values, setFieldValue}) =>
        error ? (
          <Body component="div">
            <ErrorDisplay error={error} />
          </Body>
        ) : (
          <Body component="form" onSubmit={handleSubmit}>
            {!values ? (
              <ErrorMessage level="warning">
                <FormattedMessage
                  description="Add partner modal: warning that no data is added"
                  defaultMessage="You haven't entered any data yet."
                />
              </ErrorMessage>
            ) : (
              <>
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
                    name="lastname"
                    isRequired
                    label={
                      <FormattedMessage
                        description="Label for partners lastname"
                        defaultMessage="Lastname"
                      />
                    }
                    onChange={event => {
                      setFieldValue('lastname', event.target.value);
                    }}
                  />
                  <TextField
                    name="dateOfBirth"
                    isRequired
                    label={
                      <FormattedMessage
                        description="Label for partners date of birth"
                        defaultMessage="Date of birth"
                      />
                    }
                    onChange={event => {
                      setFieldValue('dateOfBirth', event.target.value);
                    }}
                  />
                </div>
              </>
            )}

            <ButtonGroup direction="column" className="openforms-form-navigation">
              <EnterPartnerButton />
            </ButtonGroup>
          </Body>
        )
      }
    </Formik>
  );
};

AddPartnerForm.propTypes = {
  submissionUrl: PropTypes.string.isRequired,
  componentKey: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  closeModal: PropTypes.func,
};

export default AddPartnerForm;
