import React, {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {getBEMClassName} from '../../utils';
import Label from '../Label';
import {getFormattedDateString, getFormattedTimeString} from 'utils';

const ProductField = ({product, setProduct}) => {
  // todo replace mock with api call
  const data = [
    {code: 'PASAAN', identifier: '1', name: 'Paspoort aanvraag'},
    {code: 'RIJAAN', identifier: '5', name: 'Rijbewijs aanvraag (Drivers license)'},
  ];

  return (
    <div className={getBEMClassName('form-control')}>
      <Label>
        <FormattedMessage description="Appointment product field label" defaultMessage="Product" />
      </Label>

      <select
        className={getBEMClassName('select')}
        value={product}
        onChange={event => {
          setProduct(event.target.value);
          // todo empty errors
          // todo empty all other fields
        }}
      >
        <option value={''}></option>
        {data.map(item => (
          <option value={item.identifier}>{item.name}</option>
        ))}
      </select>
    </div>
  );
};

const LocationField = ({location, setLocation}) => {
  // todo replace mock with api call
  const data = [{identifier: '1', name: 'Maykin Media'}];

  return (
    <div className={getBEMClassName('form-control')}>
      <Label>
        <FormattedMessage
          description="Appointment location field label"
          defaultMessage="Location"
        />
      </Label>

      <select
        className={getBEMClassName('select')}
        value={location}
        onChange={event => {
          setLocation(event.target.value);
          // todo empty errors
          // todo empty all other fields
        }}
      >
        <option value={''}></option>
        {data.map(item => (
          <option value={item.identifier}>{item.name}</option>
        ))}
      </select>
    </div>
  );
};

const DateField = ({date, setDate}) => {
  const intl = useIntl();

  // todo replace mock with api call
  const data = [{date: '2021-08-19'}, {date: '2021-08-20'}, {date: '2021-08-23'}];

  return (
    <div className={getBEMClassName('form-control')}>
      <Label>
        <FormattedMessage description="Appointment date field label" defaultMessage="Date" />
      </Label>

      <select
        className={getBEMClassName('select')}
        value={date}
        onChange={event => {
          setDate(event.target.value);
          // todo empty errors
          // todo empty all other fields
        }}
      >
        <option value={''}></option>
        {data.map(item => (
          <option value={item.date}>{getFormattedDateString(intl, item.date)}</option>
        ))}
      </select>
    </div>
  );
};

const TimeField = ({time, setTime}) => {
  const intl = useIntl();

  // todo replace mock with api call
  const data = [{time: '2021-08-23T08:00:00+02:00'}, {time: '2021-08-23T08:10:00+02:00'}];

  return (
    <div className={getBEMClassName('form-control')}>
      <Label>
        <FormattedMessage description="Appointment time field label" defaultMessage="Time" />
      </Label>

      <select
        className={getBEMClassName('select')}
        value={time}
        onChange={event => {
          setTime(event.target.value);
          // todo empty errors
          // todo empty all other fields
        }}
      >
        <option value={''}></option>
        {data.map(item => (
          <option value={item.time}>{getFormattedTimeString(intl, item.time)}</option>
        ))}
      </select>
    </div>
  );
};

const AppointmentFields = () => {
  const [product, setProduct] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  return (
    <>
      <ProductField product={product} setProduct={setProduct} />
      <LocationField location={location} setLocation={setLocation} />
      <DateField date={date} setDate={setDate} />
      <TimeField time={time} setTime={setTime} />
    </>
  );
};

export default AppointmentFields;
