import type {PartnerDetails} from '@open-formulieren/types';
import {DataList, DataListItem, DataListKey, DataListValue} from '@utrecht/component-library-react';
import {FormattedMessage} from 'react-intl';

import {OFButton} from '@/components/Button';

import PARTNER_COMPONENTS from './definition';
import {PartnerManuallyAdded} from './types';

export interface PartnersComponentProps {
  partners: PartnerDetails[];
  hasNoPartners: boolean;
  manuallyAddedPartner?: PartnerManuallyAdded;
  onAddPartner: () => void;
  onEditPartner: () => void;
}

/**
 * Root partners component - it binds with the Formio component.
 *
 * This component manages the data/preview and necessary controls given the Formio
 * state.
 */
export const PartnersComponent: React.FC<PartnersComponentProps> = ({
  partners,
  hasNoPartners,
  manuallyAddedPartner,
  onAddPartner,
  onEditPartner,
}) => (
  <>
    <DisplayPartners partners={partners} />
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
);

export interface DisplayPartnersProps {
  partners: PartnerDetails[];
}

export const DisplayPartners: React.FC<DisplayPartnersProps> = ({partners}) => {
  const partnerFields = PARTNER_COMPONENTS.map(({key, label}) => ({
    name: key,
    label: label,
  }));

  return (
    <>
      {partners.map((partner, index) => (
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
          {index < partners.length - 1 && <hr className="utrecht-hr" />}
        </div>
      ))}
    </>
  );
};

export default PartnersComponent;
