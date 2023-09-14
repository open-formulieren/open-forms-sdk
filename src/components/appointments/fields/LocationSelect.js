import PropTypes from 'prop-types';
import React, {useCallback, useContext} from 'react';
import {defineMessage, useIntl} from 'react-intl';

import {ConfigContext} from 'Context';
import {get} from 'api';
import {getCached, setCached} from 'cache';
import {AsyncSelectField} from 'components/forms';

import {ProductsType} from '../types';

// TODO: use a nicer widget/form field than select

const CACHED_LOCATIONS_KEY = 'appointment|locations';
const CACHED_LOCATIONS_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

export const fieldLabel = defineMessage({
  description: 'Appoinments: location select label',
  defaultMessage: 'Location',
});

export const getLocations = async (baseUrl, productIds) => {
  if (!productIds.length) return [];
  const fullKey = `${CACHED_LOCATIONS_KEY}:${productIds.join(';')}`;
  let locationList = getCached(fullKey, CACHED_LOCATIONS_MAX_AGE_MS);
  if (locationList === null) {
    const multiParams = productIds.map(id => ({product_id: id}));
    locationList = await get(`${baseUrl}appointments/locations`, {}, multiParams);
    setCached(fullKey, locationList);
  }
  return locationList;
};

const LocationSelect = ({products, onChange}) => {
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const productIds = products.map(prod => prod.productId).sort(); // sort to get a stable identity
  const getOptions = useCallback(
    async () => await getLocations(baseUrl, productIds),
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
      valueProperty="identifier"
      getOptionLabel={location => location.name}
      autoSelectOnlyOption
      onChange={onChange}
    />
  );
};

LocationSelect.propTypes = {
  products: ProductsType.isRequired,
  onChange: PropTypes.func,
};

export default LocationSelect;
