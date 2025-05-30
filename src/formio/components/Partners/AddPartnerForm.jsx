import {TextField} from '@open-formulieren/formio-renderer';
import {ButtonGroup} from '@utrecht/button-group-react';
import {subDays, subYears} from 'date-fns';
import {Formik} from 'formik';
import PropTypes from 'prop-types';
import {FormattedMessage, defineMessage, useIntl} from 'react-intl';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import Body from 'components/Body';
import ErrorMessage from 'components/Errors/ErrorMessage';
import {DateField} from 'components/forms';

import EnterPartnerButton from './EnterPartnerButton';

const BSN_STRUCTURE_MESSAGE = defineMessage({
  description: 'Validation error describing shape of BSN.',
  defaultMessage: 'A BSN must be 9 digits',
});

const BSN_INVALID_MESSAGE = defineMessage({
  description: 'Validation error for BSN that does not pass the 11-test.',
  defaultMessage: 'Invalid BSN',
});

const isValidBsn = value => {
  // Formula taken from https://nl.wikipedia.org/wiki/Burgerservicenummer#11-proef
  const elevenTestValue =
    9 * parseInt(value[0]) +
    8 * parseInt(value[1]) +
    7 * parseInt(value[2]) +
    6 * parseInt(value[3]) +
    5 * parseInt(value[4]) +
    4 * parseInt(value[5]) +
    3 * parseInt(value[6]) +
    2 * parseInt(value[7]) +
    -1 * parseInt(value[8]);

  return elevenTestValue % 11 === 0;
};

const getValidationSchema = (componentKey, intl) => {
  const baseSchema = z.object({
    bsn: z
      .string()
      .length(9, {message: intl.formatMessage(BSN_STRUCTURE_MESSAGE)})
      .regex(/[0-9]{9}/, {message: intl.formatMessage(BSN_STRUCTURE_MESSAGE)})
      .refine(isValidBsn, {message: intl.formatMessage(BSN_INVALID_MESSAGE)}),
    initials: z.string().optional(),
    affixes: z.string().optional(),
    lastName: z.string(),
    dateOfBirth: z.string(),
  });

  return baseSchema;
};

const AddPartnerForm = ({partner, componentKey, onSave, closeModal}) => {
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
      validationSchema={toFormikValidationSchema(getValidationSchema(componentKey, intl))}
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
  componentKey: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  closeModal: PropTypes.func,
};

export default AddPartnerForm;
