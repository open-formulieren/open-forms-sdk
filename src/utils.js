import classNames from 'classnames';

import {applyPrefix} from './formio/utils';
import Body from './Body';
import List from './List';
import Image from './Image';


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
      return obj ? obj.label : '';
    } else if (component.type === "file") {
      /* [
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
        return `${v.originalName} (${v.size} bytes)`;
      }).join(", ")
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
