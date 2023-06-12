import {useFormikContext} from 'formik';
import React, {useCallback, useContext} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from 'Context';
import {get} from 'api';
import {AsyncSelectField} from 'components/forms';

// TODO: use a nicer widget/form field than select

const getLocations = async (baseUrl, productIds) => {
  if (!productIds.length) return [];
  const multiParams = productIds.map(id => ({product_id: id}));
  const locationList = await get(`${baseUrl}appointments/locations`, {}, multiParams);
  return locationList;
};

const LocationSelect = () => {
  const {baseUrl} = useContext(ConfigContext);
  const {values} = useFormikContext();
  const productIds = (values.products || []).map(prod => prod.product);
  const getOptions = useCallback(
    async () => await getLocations(baseUrl, productIds),
    // about JSON.stringify: https://github.com/facebook/react/issues/14476#issuecomment-471199055
    [baseUrl, JSON.stringify(productIds)]
  );
  return (
    <AsyncSelectField
      name="location"
      isRequired
      label={
        <FormattedMessage
          description="Appoinments: location select label"
          defaultMessage="Location"
        />
      }
      getOptions={getOptions}
      valueProperty="identifier"
      getOptionLabel={location => location.name}
      autoSelectOnlyOption
    />
  );
};

LocationSelect.propTypes = {};

export default LocationSelect;
