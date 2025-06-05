import {DataList, DataListItem, DataListKey, DataListValue} from '@utrecht/component-library-react';
import {useFormikContext} from 'formik';
import {useEffect} from 'react';
import {FormattedMessage} from 'react-intl';

import {Partner, PartnerFieldsProps, PartnersFormProps} from './types';

const PartnersForm: React.FC<PartnersFormProps> = ({setFormioValues}) => {
  return <PartnersFormPerson setFormioValues={setFormioValues} />;
};

const PartnersFormPerson: React.FC<PartnersFormProps> = ({setFormioValues}) => {
  const {values}: {values: Partner[]} = useFormikContext<Partner[]>();

  useEffect(() => {
    setFormioValues(values);
  });

  const partnerFields: PartnerFieldsProps[] = [
    {
      name: 'bsn',
      label: <FormattedMessage description="Label for partners BSN" defaultMessage="BSN" />,
    },
    {
      name: 'initials',
      label: (
        <FormattedMessage description="Label for partners initials" defaultMessage="Initials" />
      ),
    },
    {
      name: 'affixes',
      label: <FormattedMessage description="Label for partners affixes" defaultMessage="Affixes" />,
    },
    {
      name: 'lastName',
      label: (
        <FormattedMessage description="Label for partners lastname" defaultMessage="Lastname" />
      ),
    },
    {
      name: 'dateOfBirth',
      label: (
        <FormattedMessage
          description="Label for partners date of birth"
          defaultMessage="Date of birth"
        />
      ),
    },
  ];

  return (
    <>
      {values.map((partner, index) => (
        <div key={index}>
          <DataList>
            {partnerFields.map(({name, label}) => (
              <DataListItem key={name}>
                <DataListKey>{label}</DataListKey>
                <DataListValue>{partner[name]}</DataListValue>
              </DataListItem>
            ))}
          </DataList>

          {/* Divider between partners */}
          {index < values.length - 1 && <hr className="utrecht-hr" />}
        </div>
      ))}
    </>
  );
};

export default PartnersForm;
