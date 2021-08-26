import classNames from 'classnames';
import {FormattedNumber} from 'react-intl';

import {applyPrefix} from './formio/utils';
import Body from 'components/Body';
import List from 'components/List';
import Image from 'components/Image';
import Anchor from 'components/Anchor';


export const getBEMClassName = (base, modifiers=[]) => {
  const prefixedBase = applyPrefix(base);
  const prefixedModifiers = modifiers.map(mod => applyPrefix(`${base}--${mod}`));
  return classNames(prefixedBase, ...prefixedModifiers);
};


export const flattenComponents = (components) => {
  const flattenedComponents = components.map(component => {
    if(component.components) {
      return [component].concat(flattenComponents(component.components));
    } else {
      return [component];
    }
  });

  // Convert an array of arrays to a single array
  return [].concat.apply([], flattenedComponents);
};


export const getComponentLabel = (components, key) => {
  let component = components.find(component => component.key === key);

  // If no component is found then just return an empty string
  // This should not happen but is here to prevent a crash
  return component ? component.label : '';
};


export const getComponentValue = (inputValue, components, key) => {
    let component = components.find(component => component.key === key);

    if (component === undefined) {
      // If no component is found then just return an empty string
      // This should not happen but is here to prevent a crash
      return '';
    }

    if (component.type === "signature") {
      return inputValue ? <Image src={inputValue} alt={key} /> : '';
    } else if (component.type === "checkbox") {
      return inputValue ? 'Ja' : 'Nee';
    } else if (component.type === "select") {
      const obj = component.data.values.find(obj => obj.value === inputValue);
      // TODO inputValue is for dynamically loaded components
      //   Need to find a way to save/get the human readable value of these
      return obj ? obj.label : inputValue;
    } else if (component.type === "file") {
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
      if (!inputValue) {
        return "-";
      }
      else {
        return inputValue.map(v => {
          const {size, unit} = humanFileSize(v.size);
          return (
            <Anchor key={v.url} href={v.url}>
              {v.originalName}{' '}
              {/* eslint-disable-next-line react/style-prop-object */}
              (<FormattedNumber value={size} style="unit" unit={unit} />)
            </Anchor>
          )}
        );
      }
    } else if (component.type === "date") {
      const [year, month, day] = inputValue.split('-');
      return `${day}-${month}-${year}`;
    } else if (component.type === "selectboxes") {
      const selectedBoxes = Object.keys(inputValue).filter(key => inputValue[key] === true);
      const selectedObjs = component.values.filter(obj => selectedBoxes.includes(obj.value));
      const selectedLabels = selectedObjs.map(selectedLabel => selectedLabel.label);
      return (
        <List modifiers={['extra-compact', 'dash']}>
          {selectedLabels.map( (label, i) => <Body key={i} component="span">{label}</Body>)}
        </List>
      )
    }

    return inputValue;
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
