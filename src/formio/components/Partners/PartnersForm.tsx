import {DataList, DataListItem, DataListKey, DataListValue} from '@utrecht/component-library-react';
import {Formik, useFormikContext} from 'formik';
import {useEffect} from 'react';
import {FormattedMessage} from 'react-intl';

import {OFButton} from 'components/Button';

import PARTNER_COMPONENTS from './definition';
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

  const partnerFields: PartnerFieldsProps[] = PARTNER_COMPONENTS.map(({key, label}) => ({
    name: key,
    label: label,
  }));

  return (
    <>
      {values.map((partner, index) => (
        <div key={index}>
          <DataList>
            {partnerFields.map(({name, label}) => (
              <DataListItem key={name}>
                <DataListKey>
                  <FormattedMessage {...label} />
                </DataListKey>
                <DataListValue>
                  {partner[name] || (
                    <i>
                      <FormattedMessage
                        description="Emtpy field message"
                        defaultMessage="No information provided"
                      />
                    </i>
                  )}
                </DataListValue>
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
