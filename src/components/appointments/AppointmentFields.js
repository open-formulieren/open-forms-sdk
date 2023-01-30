import React, {useContext, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useAsync} from 'react-use';

import {ConfigContext} from 'Context';
import {get} from 'api';
import Label from 'components/Label';
import Loader from 'components/Loader';
import {getBEMClassName, getFormattedDateString, getFormattedTimeString} from 'utils';

const requestOrEmpty = async (url, query, condition) => {
  if (condition) {
    return await get(url, query);
  } else {
    return [];
  }
};

const ProductField = ({value, onChange, url}) => {
  const {loading, value: items} = useAsync(async () => await get(url));
  // todo process errors

  return (
    <div className={getBEMClassName('form-control')}>
      <Label>
        <FormattedMessage description="Appointment product field label" defaultMessage="Product" />
      </Label>

      {loading ? (
        <Loader />
      ) : (
        <select className={getBEMClassName('select')} value={value} onChange={onChange}>
          <option value={''}></option>
          {items.map(item => (
            <option value={item.identifier} key={item.identifier}>
              {item.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

const LocationField = ({value, onChange, url, urlQuery}) => {
  const {loading, value: items} = useAsync(
    async () => await requestOrEmpty(url, urlQuery, urlQuery.product_id),
    [urlQuery.product_id]
  );

  return (
    <div className={getBEMClassName('form-control')}>
      <Label>
        <FormattedMessage
          description="Appointment location field label"
          defaultMessage="Location"
        />
      </Label>

      {loading ? (
        <Loader />
      ) : (
        <select className={getBEMClassName('select')} value={value} onChange={onChange}>
          <option value={''}></option>
          {items.map(item => (
            <option value={item.identifier} key={item.identifier}>
              {item.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

const DateField = ({value, onChange, url, urlQuery}) => {
  const intl = useIntl();
  const {loading, value: items} = useAsync(
    async () => await requestOrEmpty(url, urlQuery, urlQuery.product_id && urlQuery.location_id),
    [urlQuery.product_id, urlQuery.location_id]
  );

  return (
    <div className={getBEMClassName('form-control')}>
      <Label>
        <FormattedMessage description="Appointment date field label" defaultMessage="Date" />
      </Label>

      {loading ? (
        <Loader />
      ) : (
        <select className={getBEMClassName('select')} value={value} onChange={onChange}>
          <option value={''}></option>
          {items.map(item => (
            <option value={item.date} key={item.date}>
              {getFormattedDateString(intl, item.date)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

const TimeField = ({value, onChange, url, urlQuery}) => {
  const intl = useIntl();
  const {loading, value: items} = useAsync(
    async () =>
      await requestOrEmpty(
        url,
        urlQuery,
        urlQuery.product_id && urlQuery.location_id && urlQuery.date
      ),
    [urlQuery.product_id, urlQuery.location_id, urlQuery.date]
  );

  return (
    <div className={getBEMClassName('form-control')}>
      <Label>
        <FormattedMessage description="Appointment time field label" defaultMessage="Time" />
      </Label>

      {loading ? (
        <Loader />
      ) : (
        <select className={getBEMClassName('select')} value={value} onChange={onChange}>
          <option value={''}></option>
          {items.map(item => (
            <option value={item.time} key={item.time}>
              {getFormattedTimeString(intl, item.time)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

const AppointmentFields = () => {
  const [product, setProduct] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // appointment urls
  const {baseUrl} = useContext(ConfigContext);

  return (
    <>
      <ProductField
        value={product}
        onChange={e => {
          setProduct(e.target.value);
          setLocation('');
          setDate('');
          setTime('');
        }}
        url={`${baseUrl}appointments/products`}
      />
      <LocationField
        value={location}
        onChange={e => {
          setLocation(e.target.value);
          setDate('');
          setTime('');
        }}
        url={`${baseUrl}appointments/locations`}
        urlQuery={{product_id: product}}
      />
      <DateField
        value={date}
        onChange={e => {
          setDate(e.target.value);
          setTime('');
        }}
        url={`${baseUrl}appointments/dates`}
        urlQuery={{product_id: product, location_id: location}}
      />
      <TimeField
        value={time}
        onChange={e => setTime(e.target.value)}
        url={`${baseUrl}appointments/times`}
        urlQuery={{product_id: product, location_id: location, date: date}}
      />
    </>
  );
};

export default AppointmentFields;
