import {FormioForm} from '@open-formulieren/formio-renderer';
import {JSONObject} from '@open-formulieren/formio-renderer/types.js';
import {ButtonGroup} from '@utrecht/button-group-react';
import {useContext, useMemo} from 'react';
import {useIntl} from 'react-intl';

import {FormContext} from 'Context';

import PartnerSubmitButton from './PartnerSubmitButton';
import PARTNER_COMPONENTS from './definition';
import {AddPartnerFormProps, PartnerManuallyAdded} from './types';

const AddPartnerForm: React.FC<AddPartnerFormProps> = ({partner, onSave, closeModal}) => {
  const intl = useIntl();
  const {requiredFieldsWithAsterisk} = useContext(FormContext);

  const components = useMemo(
    () =>
      PARTNER_COMPONENTS.map(component => ({
        ...component,
        label: intl.formatMessage(component.label),
      })),
    [intl]
  );

  const onSubmit = async (values: JSONObject) => {
    const partner = values as unknown as PartnerManuallyAdded;

    if (onSave) {
      onSave(partner);
      closeModal();
    }
  };

  return (
    <FormioForm
      components={components}
      values={
        partner
          ? {
              bsn: partner.bsn,
              initials: partner.initials,
              affixes: partner.affixes,
              lastName: partner.lastName,
              dateOfBirth: partner.dateOfBirth,
            }
          : {
              bsn: '',
              initials: '',
              affixes: '',
              lastName: '',
              dateOfBirth: '',
            }
      }
      onSubmit={onSubmit}
      requiredFieldsWithAsterisk={requiredFieldsWithAsterisk}
    >
      <ButtonGroup direction="column" className="openforms-form-navigation">
        <PartnerSubmitButton />
      </ButtonGroup>
    </FormioForm>
  );
};

export default AddPartnerForm;
