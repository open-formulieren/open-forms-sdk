import {FormioForm} from '@open-formulieren/formio-renderer';
import {ButtonGroup} from '@utrecht/button-group-react';
import PropTypes from 'prop-types';
import {useMemo} from 'react';
import {useIntl} from 'react-intl';

import EnterPartnerButton from './EnterPartnerButton';
import PARTNER_COMPONENTS from './definition';

const AddPartnerForm = ({partner, onSave, closeModal}) => {
  const intl = useIntl();

  const components = useMemo(
    () =>
      PARTNER_COMPONENTS.map(component => ({
        ...component,
        label: intl.formatMessage(component.label),
      })),
    [intl]
  );

  const onSubmit = async values => {
    if (onSave) {
      onSave(values);
      closeModal();
    }
  };

  return (
    <FormioForm
      components={components}
      values={
        partner ?? {
          bsn: '',
          initials: '',
          affixes: '',
          lastName: '',
          dateOfBirth: '',
        }
      }
      onSubmit={onSubmit}
      // TODO: grab from context
      requiredFieldsWithAsterisk
    >
      <ButtonGroup direction="column" className="openforms-form-navigation">
        <EnterPartnerButton />
      </ButtonGroup>
    </FormioForm>
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
