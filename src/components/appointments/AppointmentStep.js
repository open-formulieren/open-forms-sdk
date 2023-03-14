import {Formik, useField} from 'formik';
import React, {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useAsync} from 'react-use';

import {ConfigContext} from 'Context';
import {get} from 'api';
import Body from 'components/Body';
import Button from 'components/Button';
import Card from 'components/Card';
import Label from 'components/Label';
import Loader from 'components/Loader';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import ValidationErrors from 'components/ValidationErrors';
import {getBEMClassName, getFormattedDateString, getFormattedTimeString} from 'utils';

const requestOrEmpty = async (url, query, condition) => {
  if (condition) {
    return await get(url, query);
  } else {
    return [];
  }
};

const AppointmentField = ({
  label,
  getOptionValue,
  getOptionLabel,
  url,
  urlQuery = [],
  ...props
}) => {
  const [field, meta] = useField(props);
  const urlQueryValues = urlQuery.map(param => param[1]);
  // load options from appointments api
  const {loading, value: items} = useAsync(async () => {
    if (urlQuery) {
      const notEmpty = urlQueryValues.every(val => !!val);
      return await requestOrEmpty(url, Object.fromEntries(urlQuery), notEmpty);
    } else {
      return await get(url);
    }
  }, urlQueryValues);

  return (
    <div className={getBEMClassName('form-control')}>
      <Label>
        <FormattedMessage
          description="Appointment {name} field label"
          defaultMessage="{label}"
          values={{label: label, name: props.name}}
        />
      </Label>

      {loading ? (
        <Loader />
      ) : (
        <>
          <select className={getBEMClassName('select')} required={true} {...field} {...props}>
            <option value={''}></option>
            {items.map(item => {
              return (
                <option value={getOptionValue(item)} key={getOptionValue(item)}>
                  {getOptionLabel(item)}
                </option>
              );
            })}
          </select>
          {meta.touched && meta.error ? <ValidationErrors errors={[meta.error]} /> : null}
        </>
      )}
    </div>
  );
};

const AppointmentStep = ({onSubmit}) => {
  const {baseUrl} = useContext(ConfigContext);
  const intl = useIntl();

  return (
    <Card
      title={
        <FormattedMessage
          description="Experiment appointment step"
          defaultMessage="Appointment details"
        />
      }
    >
      <Formik
        initialValues={{product: '', location: '', date: '', time: ''}}
        onSubmit={values => {
          console.log('values=', values);
          onSubmit();
        }}
      >
        {formik => (
          <Body component="form" onSubmit={formik.handleSubmit}>
            <AppointmentField
              name="product"
              label="Product"
              getOptionValue={item => item.identifier}
              getOptionLabel={item => item.name}
              url={`${baseUrl}appointments/products`}
              onChange={e => {
                // default handler
                formik.handleChange(e);
                // empty other fields to prevent unnecessary requests
                formik.setFieldValue('location', '');
                formik.setFieldValue('date', '');
                formik.setFieldValue('time', '');
              }}
            />
            <AppointmentField
              name="location"
              label="Location"
              getOptionValue={item => item.identifier}
              getOptionLabel={item => item.name}
              url={`${baseUrl}appointments/locations`}
              urlQuery={[['product_id', formik.values.product]]}
              onChange={e => {
                // default handler
                formik.handleChange(e);
                // empty other fields to prevent unnecessary requests
                formik.setFieldValue('date', '');
                formik.setFieldValue('time', '');
              }}
            />
            <AppointmentField
              name="date"
              label="Date"
              getOptionValue={item => item.date}
              getOptionLabel={item => getFormattedDateString(intl, item.date)}
              url={`${baseUrl}appointments/dates`}
              urlQuery={[
                ['product_id', formik.values.product],
                ['location_id', formik.values.location],
              ]}
              onChange={e => {
                // default handler
                formik.handleChange(e);
                // empty other fields to prevent unnecessary requests
                formik.setFieldValue('time', '');
              }}
            />
            <AppointmentField
              name="time"
              label="Time"
              getOptionValue={item => item.time}
              getOptionLabel={item => getFormattedTimeString(intl, item.time)}
              url={`${baseUrl}appointments/times`}
              urlQuery={[
                ['product_id', formik.values.product],
                ['location_id', formik.values.location],
                ['date', formik.values.date],
              ]}
            />

            <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
              <ToolbarList>
                <Button type="submit" variant="primary">
                  <FormattedMessage description="Save appointment" defaultMessage="Next" />
                </Button>
              </ToolbarList>
            </Toolbar>
          </Body>
        )}
      </Formik>
    </Card>
  );
};

export default AppointmentStep;
