import {FormattedNumber} from 'react-intl';
import {flattenComponents, getFormattedDateString, getFormattedTimeString} from 'utils';
import Anchor from 'components/Anchor';
import Body from 'components/Body';
import Image from 'components/Image';
import List from 'components/List';
import Map from 'components/Map';

export const iterComponentKeyValues = (components, data) => {
  // Iterate over (pre-flattened) components and return key/values
  // Often used in combination with flattenComponents and getComponentLabel/getComponentValue

  const noDataComponentsToInclude = ['fieldset'];

  return components.filter(component => {
    return component.key in data || noDataComponentsToInclude.includes(component.type);
  }).map(component => {
    return {key: component.key, value: data[component.key]};
  });
};

const getFieldSetRelatedComponentModifiers = (currentComponent, allComponents) => {
  let modifiers = [];

  if (currentComponent.type === 'fieldset') {
    modifiers.push('fieldset');
  }

  const fieldsetComponents = allComponents.filter(component => component.type === 'fieldset');
  for (let fieldsetComponent of fieldsetComponents) {
    const lastComponent = flattenComponents(fieldsetComponent['components']).at(-1);
    if (lastComponent.key === currentComponent.key) {
      modifiers.push('last-fieldset-component');
      break;
    }
  }

  return modifiers;
};


export const getComponentModifiers = (components, key) => {
  let component = components.find(component => component.key === key);

  let modifiers = [];

  if (component === undefined) {
    // If no component is found then just return an empty array
    return modifiers;
  }

  modifiers = modifiers.concat(getFieldSetRelatedComponentModifiers(component, components));

  return modifiers;
};


export const getComponentLabel = (components, key) => {
  let component = components.find(component => component.key === key);

  if (component === undefined) {
    // If no component is found then just return an empty string
    // This should not happen but is here to prevent a crash
    return '';
  }

  switch (component.type) {
    case 'fieldset' : {
      return <b>{component.label}</b>
    }
    default:
      return component.label;
  }
};


export const getComponentValue = (inputValue, components, key, intl) => {
    let component = components.find(component => component.key === key);

    if (component === undefined) {
      // If no component is found then just return an empty string
      // This should not happen but is here to prevent a crash
      return '';
    }

    if (!inputValue) return '';

    switch (component.type) {
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
