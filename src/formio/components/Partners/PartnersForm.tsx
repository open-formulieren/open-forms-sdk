import {TextField} from '@open-formulieren/formio-renderer';
import {useFormikContext} from 'formik';
import {useEffect} from 'react';
import {FormattedMessage} from 'react-intl';

import {Partner, PartnersFormProps} from './types';

const PartnersForm: React.FC<PartnersFormProps> = ({setFormioValues}) => {
  return <PartnersFormPerson setFormioValues={setFormioValues} />;
};

const PartnersFormPerson: React.FC<PartnersFormProps> = ({setFormioValues}) => {
  const {values, isValid}: {values: Partner[]; isValid: boolean} = useFormikContext<Partner[]>();

  useEffect(() => {
    setFormioValues(values, isValid);
  }, [values, isValid]);

  return (
    <>
      {values.map((_, index) => (
        <div key={index}>
          <TextField
            name={`${index}.bsn`}
            label={<FormattedMessage description="Label for partners BSN" defaultMessage="BSN" />}
            readOnly
          />
          <TextField
            name={`${index}.initials`}
            label={
              <FormattedMessage
                description="Label for partners initials"
                defaultMessage="Initials"
              />
            }
            readOnly
          />
          <TextField
            name={`${index}.affixes`}
            label={
              <FormattedMessage description="Label for partners affixes" defaultMessage="Affixes" />
            }
            readOnly
          />
          <TextField
            name={`${index}.lastname`}
            label={
              <FormattedMessage
                description="Label for partners lastname"
                defaultMessage="Lastname"
              />
            }
            readOnly
          />
          <TextField
            name={`${index}.dateOfBirth`}
            label={
              <FormattedMessage
                description="Label for partners date of birth"
                defaultMessage="Date of birth"
              />
            }
            readOnly
          />
        </div>
      ))}
    </>
  );
};

export default PartnersForm;
