import {SecondaryActionButton} from '@open-formulieren/formio-renderer';
import type {PartnerDetails} from '@open-formulieren/types';
import {DataList, DataListItem, DataListKey, DataListValue} from '@utrecht/component-library-react';
import {FormattedMessage} from 'react-intl';

import PARTNER_COMPONENTS from './definition';
import type {PartnerManuallyAdded} from './types';

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
      <SecondaryActionButton onClick={onAddPartner}>
        <FormattedMessage
          description="Add partner: add partner button text"
          defaultMessage="Add partner"
        />
      </SecondaryActionButton>
    )}
    {!hasNoPartners && manuallyAddedPartner && (
      <SecondaryActionButton onClick={onEditPartner}>
        <FormattedMessage
          description="Edit partner: edit partner button text"
          defaultMessage="Edit partner"
        />
      </SecondaryActionButton>
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
