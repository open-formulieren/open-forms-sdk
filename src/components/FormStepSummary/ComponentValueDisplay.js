import PropTypes from 'prop-types';
import React from 'react';
import {FormattedDate, FormattedMessage, FormattedNumber, FormattedTime, useIntl} from 'react-intl';

import Anchor from 'components/Anchor';
import Body from 'components/Body';
import CoSign from 'components/CoSign';
import Image from 'components/Image';
import List from 'components/List';
import Map from 'components/Map';
import {getFormattedDateString, getFormattedTimeString} from 'utils';

import {humanFileSize} from './utils';

const EmptyDisplay = () => '';

const DefaultDisplay = ({component, value}) => {
  if (value == null) return '';
  if (value === '') return <EmptyDisplay />;
  return value.toString();
};

const SignatureDisplay = ({component, value}) => {
  if (!value) {
    return <EmptyDisplay />;
  }
  return <Image src={value} alt={component.key} />;
};

const CheckboxDisplay = ({component, value}) => {
  if (value) {
    return <FormattedMessage description="'True' display" defaultMessage="yes" />;
  }
  return <FormattedMessage description="'False' display" defaultMessage="no" />;
};

const RadioDisplay = ({component, value}) => {
  if (!value) {
    return <EmptyDisplay />;
  }
  const obj = component.values.find(obj => obj.value === value);
  return obj ? obj.label : value;
};

const SelectDisplay = ({component, value}) => {
  const intl = useIntl();
  if (!value) {
    return <EmptyDisplay />;
  }

  // special appointment cases
  if (component.appointments?.showProducts || component.appointments?.showLocations) {
    return value.name;
  } else if (component.appointments?.showDates) {
    return getFormattedDateString(intl, value);
  } else if (component.appointments?.showTimes) {
    return getFormattedTimeString(intl, value);
  }

  const obj = component.data.values.find(obj => obj.value === value);
  return obj ? obj.label : value;
};

const DateDisplay = ({component, value}) => {
  if (!value) return <EmptyDisplay />;
  const [year, month, day] = value.split('-');
  const date = new Date();
  date.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day));
  return <FormattedDate value={date} />;
};

const DateTimeDisplay = ({component, value}) => {
  if (!value) return <EmptyDisplay />;
  const datetime = Date.parse(value);
  return (
    <>
      <FormattedDate value={datetime} />
      &nbsp;
      <FormattedTime value={datetime} />
    </>
  );
};

const TimeDisplay = ({component, value}) => {
  if (!value) return <EmptyDisplay />;
  const [hours, minutes, seconds] = value.split(':');
  const time = new Date();
  time.setHours(hours);
  time.setMinutes(minutes);
  time.setSeconds(seconds);
  return <FormattedTime value={time} />;
};

const SelectboxesDisplay = ({component, value}) => {
  if (!value) {
    return <EmptyDisplay />;
  }

  const selectedBoxes = Object.keys(value).filter(key => value[key] === true);
  if (!selectedBoxes.length) {
    return <EmptyDisplay />;
  }

  const selectedObjs = component.values.filter(obj => selectedBoxes.includes(obj.value));
  const selectedLabels = selectedObjs.map(selectedLabel => selectedLabel.label);
  return (
    <List modifiers={['extra-compact', 'dash']}>
      {selectedLabels.map((label, i) => (
        <Body key={i} component="span">
          {label}
        </Body>
      ))}
    </List>
  );
};

const FileDisplay = ({component, value}) => {
  /*
    NOTE the structure of the data set by FormIO's file component. It's an array for
    both single/multiple values, so we have to normalize this.

    [
       {
           "url": "http://server/api/v2/submissions/files/62f2ec22-da7d-4385-b719-b8637c1cd483",
           "data": {
               "url": "http://server/api/v2/submissions/files/62f2ec22-da7d-4385-b719-b8637c1cd483",
               "form": "",
               "name": "my-image.jpg",
               "size": 46114,
               "baseUrl": "http://server",
               "project": "",
           },
           "name": "my-image-12305610-2da4-4694-a341-ccb919c3d543.jpg",
           "size": 46114,
           "type": "image/jpg",
           "storage": "url",
           "originalName": "my-image.jpg",
       }
    ] */

  // Case where no file was uploaded
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return <EmptyDisplay />;
  }

  // Normalize in case we get an array for a single value
  if (!component.multiple && Array.isArray(value)) {
    value = value[0];
  }

  const {url, size: sizeInBytes, originalName} = value;
  const {size, unit} = humanFileSize(sizeInBytes);

  return (
    <Anchor key={url} href={url}>
      {originalName} {/* eslint-disable-next-line react/style-prop-object */}
      (<FormattedNumber value={size} style="unit" unit={unit} />)
    </Anchor>
  );
};

const NumberDisplay = ({component, value}) => {
  if (!value && value !== 0) return <EmptyDisplay />;

  return <FormattedNumber value={value} maximumFractionDigits={component.decimalLimit} />;
};

const CurrencyDisplay = ({component, value}) => {
  if (!value && value !== 0) return <EmptyDisplay />;

  return (
    <FormattedNumber
      value={value}
      style="currency"
      currency="EUR"
      minimumFractionDigits={component.decimalLimit || 2}
      maximumFractionDigits={component.decimalLimit || 2}
    />
  );
};

const MapDisplay = ({component, value}) => {
  if (!value) {
    return <EmptyDisplay />;
  }

  return <Map markerCoordinates={value} disabled />;
};

const PasswordDisplay = ({component, value}) => {
  if (!value) {
    return <EmptyDisplay />;
  }

  return Array.from(value)
    .map(() => '*')
    .join('');
};

const CoSignDisplay = ({component, value}) => {
  if (!value) {
    return <EmptyDisplay />;
  }
  return <CoSign interactive={false} />;
};

const ComponentValueDisplay = ({value, component}) => {
  const {multiple = false, type} = component;

  if (!value) {
    return <EmptyDisplay />;
  }

  const Formatter = TYPE_TO_COMPONENT[type] || DefaultDisplay;

  if (multiple) {
    const values = Array.isArray(value) ? value : [value];
    const renderedValues = values.map(componentValue => (
      <Formatter component={component} value={componentValue} />
    ));

    return (
      <>
        {renderedValues.map((renderedValue, index) => (
          <React.Fragment key={index}>
            {!!index && '; '}
            {renderedValue}
          </React.Fragment>
        ))}
      </>
    );
  }

  return <Formatter component={component} value={value} />;
};

ComponentValueDisplay.propTypes = {
  component: PropTypes.object.isRequired,
};

// mapping of Formio types to respective React components
const TYPE_TO_COMPONENT = {
  signature: SignatureDisplay,
  checkbox: CheckboxDisplay,
  radio: RadioDisplay,
  select: SelectDisplay,
  file: FileDisplay,
  date: DateDisplay,
  datetime: DateTimeDisplay,
  time: TimeDisplay,
  selectboxes: SelectboxesDisplay,
  number: NumberDisplay,
  currency: CurrencyDisplay,
  map: MapDisplay,
  password: PasswordDisplay,
  coSign: CoSignDisplay,
};

export default ComponentValueDisplay;
