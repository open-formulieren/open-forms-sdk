import {FormattedNumber} from 'react-intl';
import {getFormattedDateString, getFormattedTimeString} from 'utils';
import Anchor from 'components/Anchor';
import Body from 'components/Body';
import Image from 'components/Image';
import List from 'components/List';
import Map from 'components/Map';

export const iterComponentsWithData = (components, data) => {
  // Iterate over (pre-flattened) components and return key/values
  // Often used in combination with flattenComponents and getComponentLabel/getComponentValue
  return components.map(component => ({
    ...component,
    value: data[component.key],
  }));
};


export const getComponentLabel = (component) => {
  if (component === undefined) {
    // If no component is found then just return an empty string
    // This should not happen but is here to prevent a crash
    return '';
  }
  const {label, type} = component;

  switch (type) {
    case 'fieldset' : {
      return (<strong>{label}</strong>);
    }
    default:
      return label;
  }
};


export const getComponentValue = (component, intl) => {
  if (component === undefined) {
    // If no component is found then just return an empty string
    // This should not happen but is here to prevent a crash
    return '';
  }

  const { type, key, value: rawValue } = component;
  const inputValue = displayValue(rawValue);
  if (!inputValue && type !== 'coSign') return '';

  switch (type) {
    case 'signature' : {
      return <Image src={inputValue} alt={key}/>;
    }
    case 'checkbox': {
      return inputValue ? 'Ja' : 'Nee';
    }
    case 'radio': {
      const obj = component.values.find(obj => obj.value === inputValue);
      return obj ? obj.label : '';
    }
    case 'select': {
      if (component.appointments?.showProducts || component.appointments?.showLocations) {
        return inputValue.name;
      } else if (component.appointments?.showDates) {
        return getFormattedDateString(intl, inputValue);
      } else if (component.appointments?.showTimes) {
        return getFormattedTimeString(intl, inputValue);
      } else {
        const obj = component.data.values.find(obj => obj.value === inputValue);
        return obj ? obj.label : '';
      }
    }
    case 'file': {
      /*
     NOTE the structure of the data set by FormIO's file component
       [
          {
              "url": "http://server/api/v1/submissions/files/62f2ec22-da7d-4385-b719-b8637c1cd483",
              "data": {
                  "url": "http://server/api/v1/submissions/files/62f2ec22-da7d-4385-b719-b8637c1cd483",
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
      return inputValue.map(v => {
          const {size, unit} = humanFileSize(v.size);
          return (
            <Anchor key={v.url} href={v.url}>
              {v.originalName}{' '}
              {/* eslint-disable-next-line react/style-prop-object */}
              (<FormattedNumber value={size} style="unit" unit={unit}/>)
            </Anchor>
          )
        }
      );
    }
    case 'date': {
      const [year, month, day] = inputValue.split('-');
      return `${day}-${month}-${year}`;
    }
    case 'selectboxes': {
      const selectedBoxes = Object.keys(inputValue).filter(key => inputValue[key] === true);
      const selectedObjs = component.values.filter(obj => selectedBoxes.includes(obj.value));
      const selectedLabels = selectedObjs.map(selectedLabel => selectedLabel.label);
      return (
        <List modifiers={['extra-compact', 'dash']}>
          {selectedLabels.map((label, i) => <Body key={i} component="span">{label}</Body>)}
        </List>
      );
    }
    case 'map':
      return <Map markerCoordinates={inputValue} disabled />;
    case 'password':
      return Array.from(inputValue).map(() => '*').join('');
    case 'coSign': {
      return 'cosign';
    }
    default:
      return inputValue;
  }
};



/**
 * Takes a file size in bytes and returns the appropriate human readable value + unit
 * to use.
 * @param  {Number} size File size in bytes
 * @return {Object}      Object with the human readable number and unit.
 */
const humanFileSize = (size) => {
  if (size === 0) {
    return {size: 0, unit: 'byte'};
  }
  const index = Math.floor( Math.log(size) / Math.log(1024) );
  const newSize = (size / Math.pow(1024, index)).toFixed(2) * 1;
  const unit = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'][index];
  return {size: newSize, unit};
};


export const displayValue = (value) => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return value;
};
