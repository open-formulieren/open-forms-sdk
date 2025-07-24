import {FormioForm} from '@open-formulieren/formio-renderer';
import {JSONObject} from '@open-formulieren/formio-renderer/types.js';
import type {AnyComponentSchema} from '@open-formulieren/types';
import {ButtonGroup} from '@utrecht/button-group-react';
import {useContext, useMemo} from 'react';
import {useIntl} from 'react-intl';

import {FormContext} from '@/Context';

import ChildrenSubmitButton from './ChildrenSubmitButton';
import CHILDREN_COMPONENTS from './definition';
import {ChildExtendedDetails} from './types';

export interface AddChildrenFormProps {
  childValues: ChildExtendedDetails | null;
  onSave: (child: ChildExtendedDetails) => void;
}

const AddChildForm: React.FC<AddChildrenFormProps> = ({childValues, onSave}) => {
  const intl = useIntl();
  const {requiredFieldsWithAsterisk} = useContext(FormContext);

  const components: AnyComponentSchema[] = useMemo(
    () =>
      CHILDREN_COMPONENTS.map(component => ({
        ...component,
        label: intl.formatMessage(component.label),
      })),
    [intl]
  );

  const onSubmit = async (values: JSONObject) => {
    const child = values as unknown as ChildExtendedDetails;
    onSave(child);
  };

  return (
    <FormioForm
      components={components}
      values={childValues ? {...childValues} : undefined}
      onSubmit={onSubmit}
      requiredFieldsWithAsterisk={requiredFieldsWithAsterisk}
    >
      <ButtonGroup direction="column" className="openforms-form-navigation">
        <ChildrenSubmitButton />
      </ButtonGroup>
    </FormioForm>
  );
};

export default AddChildForm;
