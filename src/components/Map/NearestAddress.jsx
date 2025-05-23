import PropTypes from 'prop-types';
import {useContext} from 'react';
import {FormattedMessage} from 'react-intl';
import {useAsync} from 'react-use';

import {ConfigContext} from 'Context';
import {get} from 'api';
import Loader from 'components/Loader';
import {getBEMClassName} from 'utils';

import './MapAddress.scss';

/**
 * Retrieve and display the nearest address label for the selected coordinates.
 */
const NearestAddress = ({coordinates}) => {
  const {baseUrl} = useContext(ConfigContext);
  const [lat, lng] = coordinates;
  // XXX: this would benefit from caching, but rather than rolling our own we should
  // probably look into useQuery/tanstack react query
  const {
    loading,
    value: address,
    error,
  } = useAsync(async () => {
    const data = await get(`${baseUrl}geo/latlng-search`, {lat, lng});
    return data ? data.label : null;
  }, [baseUrl, lat, lng]);
  // silent failure for a non-critical part
  if (error) {
    console.error(error);
    // XXX: see if we can send this to Sentry
    return null;
  }
  if (address === null) return null;
  return (
    <div className={getBEMClassName('map-address')}>
      {loading ? (
        <Loader modifiers={['only-child', 'small']} />
      ) : (
        // can't put address inside a p element
        <div className="utrecht-paragraph">
          <FormattedMessage
            description="Reverse geocoded address result display"
            defaultMessage="Nearest address: <address></address>"
            values={{
              address: () => (
                <address className={getBEMClassName('map-address__description')}>{address}</address>
              ),
            }}
          />
        </div>
      )}
    </div>
  );
};

NearestAddress.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default NearestAddress;
