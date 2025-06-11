import {DataList, DataListItem, DataListKey, DataListValue} from '@utrecht/component-library-react';
import {Formik, useFormikContext} from 'formik';
import {useEffect} from 'react';
import {FormattedMessage} from 'react-intl';

import {OFButton} from 'components/Button';

import {Partner, PartnerFieldsProps, PartnersFormProps, PartnersFormikProps} from './types';

export const PartnersFormik: React.FC<PartnersFormikProps> = ({
  initialValues,
  onFormikChange,
  hasNoPartners,
  manuallyAddedPartner,
  onAddPartner,
  onEditPartner,
}) => {
  return (
    <Formik initialValues={initialValues} enableReinitialize onSubmit={() => {}}>
      <>
        <PartnersForm setFormioValues={onFormikChange} />
        {hasNoPartners && (
          <OFButton onClick={onAddPartner} variant="primary" appearance="primary-action-button">
            <FormattedMessage
              description="Add partner: add partner button text"
              defaultMessage="Add partner"
            />
          </OFButton>
        )}
        {!hasNoPartners && manuallyAddedPartner && (
          <OFButton onClick={onEditPartner} variant="primary" appearance="primary-action-button">
            <FormattedMessage
              description="Edit partner: edit partner button text"
              defaultMessage="Edit partner"
            />
          </OFButton>
        )}
      </>
    </Formik>
  );
};

export const PartnersForm: React.FC<PartnersFormProps> = ({setFormioValues}) => {
  const {values} = useFormikContext<Partner[]>();

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

export default PartnersFormik;
