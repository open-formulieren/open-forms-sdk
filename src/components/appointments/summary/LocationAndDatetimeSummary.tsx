import {LoadingIndicator} from '@open-formulieren/formio-renderer';
import {Heading3, UnorderedList, UnorderedListItem} from '@utrecht/component-library-react';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useAsync} from 'react-use';

import {ConfigContext} from '@/Context';
import type {AppointmentProduct} from '@/data/appointments';

import {getLocations} from '../fields/LocationSelect';

export interface LocationAndDateTimeSummaryProps {
  products: AppointmentProduct[];
  selectedLocationIdentifier: string;
  selectedLocationDatetime: string;
}

export const LocationAndDateTimeSummary: React.FC<LocationAndDateTimeSummaryProps> = ({
  products,
  selectedLocationIdentifier,
  selectedLocationDatetime,
}) => {
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const productIds = products.map(prod => prod.productId).sort(); // sort to get a stable identity
  const {
    loading,
    value: allLocations = [],
    error,
  } = useAsync(async () => await getLocations(baseUrl, productIds));

  if (!products.length) return null;
  if (error) throw error;
  if (loading) {
    return <LoadingIndicator size="small" />;
  }

  const selectedLocation = allLocations.find(l => l.identifier === selectedLocationIdentifier);

  return (
    <>
      <Heading3 className="utrecht-heading-3--distanced">
        <FormattedMessage
          description="Location summary on appointments contact details step heading"
          defaultMessage="Your appointment"
        />
      </Heading3>

      {/* A list is not really needed here but we keep it consistent with the products */}
      <UnorderedList className="utrecht-unordered-list--distanced">
        <UnorderedListItem key={selectedLocationIdentifier}>
          {[
            selectedLocation?.name,
            selectedLocation?.city,
            intl.formatDate(selectedLocationDatetime, {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            }),
          ]
            .filter(Boolean)
            .join(', ')}
        </UnorderedListItem>
      </UnorderedList>
    </>
  );
};
