import {useCallback, useContext} from 'react';
import {defineMessage, useIntl} from 'react-intl';
import type {MessageDescriptor} from 'react-intl';

import {ConfigContext} from '@/Context';
import {get} from '@/api';
import {getCached, setCached} from '@/cache';
import AsyncSelectField from '@/components/forms/SelectField/AsyncSelectField';
import type {AppointmentProduct, Location} from '@/data/appointments';

// TODO: use a nicer widget/form field than select

const CACHED_LOCATIONS_KEY = 'appointment|locations';
const CACHED_LOCATIONS_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

export const fieldLabel: MessageDescriptor = defineMessage({
  description: 'Appoinments: location select label',
  defaultMessage: 'Location',
});

export const getLocations = async (baseUrl: string, productIds: string[]): Promise<Location[]> => {
  if (!productIds.length) return [];
  const fullKey = `${CACHED_LOCATIONS_KEY}:${productIds.join(';')}`;
  let locationList: Location[] | null = getCached<Location[]>(fullKey, CACHED_LOCATIONS_MAX_AGE_MS);
  if (locationList === null) {
    const multiParams = productIds.map(id => ({product_id: id}));
    locationList = (await get<Location[]>(`${baseUrl}appointments/locations`, {}, multiParams))!;
    setCached<Location[]>(fullKey, locationList);
  }
  return locationList;
};

export interface LocationSelectProps {
  products: AppointmentProduct[];
}

const LocationSelect: React.FC<LocationSelectProps> = ({products}) => {
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const productIds = products.map(prod => prod.productId).sort(); // sort to get a stable identity

  const getAddressDetails = (location: Location): string => {
    const {name, address, postalcode, city} = location;

    const details = [address, postalcode, city].filter(Boolean).join(', ');
    const fullText = details ? `${name} (${details})` : name;
    return fullText;
  };

  const getOptions = useCallback(
    async () => {
      const locations = await getLocations(baseUrl, productIds);
      return locations.map(location => ({
        value: location.identifier,
        label: getAddressDetails(location),
      }));
    },
    // about JSON.stringify: https://github.com/facebook/react/issues/14476#issuecomment-471199055
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseUrl, JSON.stringify(productIds)]
  );
  return (
    <AsyncSelectField
      name="location"
      isRequired
      label={intl.formatMessage(fieldLabel)}
      getOptions={getOptions}
      autoSelectOnlyOption
    />
  );
};

export default LocationSelect;
