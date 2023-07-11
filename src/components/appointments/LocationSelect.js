import PropTypes from 'prop-types';
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

const LocationSelect = ({products}) => {
  const {baseUrl} = useContext(ConfigContext);
  const productIds = products.map(prod => prod.productId);
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
      validateOnChange
    />
  );
};

LocationSelect.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default LocationSelect;
