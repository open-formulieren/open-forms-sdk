import {FormioForm} from '@open-formulieren/formio-renderer';
import type {JSONObject} from '@open-formulieren/formio-renderer/types.js';
import type {AnyComponentSchema} from '@open-formulieren/types';
import type {PartnerDetails} from '@open-formulieren/types/dist/components/partners';
import {ButtonGroup} from '@utrecht/button-group-react';
import {useContext, useMemo} from 'react';
import {useIntl} from 'react-intl';

import {FormContext} from '@/Context';

import PartnerSubmitButton from './PartnerSubmitButton';
import PARTNER_COMPONENTS from './definition';
import type {PartnerManuallyAdded} from './types';

export interface AddPartnerFormProps {
  partner: PartnerDetails | null;
  onSave: (partner: PartnerDetails) => void;
}

const AddPartnerForm: React.FC<AddPartnerFormProps> = ({partner, onSave}) => {
  const intl = useIntl();
  const {requiredFieldsWithAsterisk} = useContext(FormContext);

  const components: AnyComponentSchema[] = useMemo(
    () =>
      PARTNER_COMPONENTS.map(component => ({
        ...component,
        label: intl.formatMessage(component.label),
      })),
    [intl]
  );

  const onSubmit = async (values: JSONObject) => {
    const partner = values as unknown as PartnerManuallyAdded;
    onSave(partner);
  };

  return (
    <FormioForm
      components={components}
      values={partner ? {...partner} : undefined}
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
