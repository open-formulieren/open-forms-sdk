import {getComponentsMap} from '@open-formulieren/formio-renderer/formio.js';
import {useFormSettings} from '@open-formulieren/formio-renderer/hooks.js';
import type {AnyComponentSchema} from '@open-formulieren/types';
import {getIn, useFormikContext} from 'formik';
import {useEffect, useMemo, useRef} from 'react';

import type {AutoCompleteResult} from '@/data/geo';

const POSTCODE_REGEX = /^[0-9]{4}\s?[a-zA-Z]{2}$/;
const HOUSE_NUMBER_REGEX = /^\d+$/;

export const LOCATION_AUTOCOMPLETE_DEBOUNCE = 300;

interface AddressAutoCompleteGroup {
  postcodeKey: string;
  houseNumberKey: string;
  targets: Array<{
    key: string;
    type: 'streetName' | 'city';
    isReadOnly: boolean;
  }>;
}

/**
 * Given a list of components, analyse it and extract the dependencies between address
 * autocomplete components.
 */
const getAddressAutoCompleteGroups = (
  components: AnyComponentSchema[]
): AddressAutoCompleteGroup[] => {
  const groups: AddressAutoCompleteGroup[] = [];
  const componentsMap = getComponentsMap(components);

  Object.values(componentsMap)
    // naive forEach loop because a .filter does not type-narrow :(
    .forEach(component => {
      if (component.type !== 'textfield') return;
      const {key, deriveCity, deriveStreetName, derivePostcode, deriveHouseNumber} = component;
      // skip components that don't request autofill
      if (!deriveStreetName && !deriveCity) return;
      // skip components that don't have any reference components configured
      if (!(derivePostcode && deriveHouseNumber)) return;
      // skip components that point to non-existing reference components
      if (!(derivePostcode in componentsMap && deriveHouseNumber in componentsMap)) return;

      // check if there is an existing group to add the target to, for efficient batched
      // state updates
      const target: AddressAutoCompleteGroup['targets'][number] = {
        key: key,
        type: deriveStreetName ? 'streetName' : 'city',
        isReadOnly: 'disabled' in component ? !!component.disabled : false,
      };
      const existingGroup = groups.find(
        ({postcodeKey, houseNumberKey}) =>
          postcodeKey === derivePostcode && houseNumberKey === deriveHouseNumber
      );
      if (existingGroup) {
        existingGroup.targets.push(target);
      } else {
        groups.push({
          postcodeKey: derivePostcode,
          houseNumberKey: deriveHouseNumber,
          targets: [target],
        });
      }
    });

  return groups;
};

export interface AddressAutoFillObserversProps {
  components: AnyComponentSchema[];
}

/**
 * Wire up a formik values observer that performs the address auto complete when source
 * inputs change.
 *
 * The derived address fields get updated if any of the two conditions are satisfied:
 *
 * - the field is marked as read-only, preventing the end-user from modifying it
 *   directly
 * - the field has an empty-ish value, meaning that we can safely set the value without
 *   potentially overwriting what the end-user entered
 *
 * There are known usability issues with this flow. Those have been addressed or are
 * being addressed in the `addressNL` component type. The advice for form builders is
 * to convert their forms to use `addressNL` instead. This feature based on the
 * textfield component is considered final and too complex to further develop/improve.
 * It was only backported with the new renderer because the original planned automatic
 * migration to `addressNL` components is not feasible within budget and without
 * bothering form builders - see https://github.com/open-formulieren/open-forms/issues/6239.
 */
const AddressAutoFillObservers: React.FC<AddressAutoFillObserversProps> = ({components}) => {
  const groups = useMemo(() => getAddressAutoCompleteGroups(components), [components]);

  // re-use the top-level context for the address auto complete API interaction
  const formSettings = useFormSettings();
  const doAddressAutoComplete = formSettings?.componentParameters?.addressNL?.addressAutoComplete;
  if (!doAddressAutoComplete) return null;
  return (
    <>
      {groups.map(group => (
        <AddressAutoFillObserver
          key={`${group.postcodeKey}/${group.houseNumberKey}`}
          group={group}
          getAddressAutoComplete={doAddressAutoComplete}
        />
      ))}
    </>
  );
};

interface AddressAutoFillObserverProps {
  group: AddressAutoCompleteGroup;
  getAddressAutoComplete: (
    postcode: string,
    houseNumber: string
  ) => Promise<AutoCompleteResult | null>;
}

const AddressAutoFillObserver: React.FC<AddressAutoFillObserverProps> = ({
  group,
  getAddressAutoComplete,
}) => {
  const {setFieldValue, values} = useFormikContext();

  const timerRef = useRef<number | null>(null);
  const updateableTargetsRef = useRef<typeof group.targets>(group.targets);

  const postcode: string = getIn(values, group.postcodeKey);
  const houseNumber = String(getIn(values, group.houseNumberKey));

  // derive the subset of targets that can be updated in a useEffect hook - this
  // collection changes based on the form values (a value has been set) or the readOnly
  // state, so it depends on the group & formik values.
  // Uses a mutable ref that doesn't trigger re-renders when it changes, otherwise we
  // end up in infinite loops because the autocomplete updates the formik values and
  // changes this collection by definition :)
  useEffect(() => {
    updateableTargetsRef.current = group.targets.filter(({key, isReadOnly}) => {
      const currentValue: string = getIn(values, key);
      const canAssignValue = isReadOnly || !currentValue;
      return canAssignValue;
    });
  }, [group, values]);

  useEffect(() => {
    let isMounted = true;
    const updateableTargets = updateableTargetsRef.current;

    const isValidPostcode = POSTCODE_REGEX.test(postcode);
    const isValidHouseNumber = HOUSE_NUMBER_REGEX.test(houseNumber);

    if (isValidHouseNumber && isValidPostcode && updateableTargets.length) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // fetch the address auto complete when the input changes
      // we debounce to prevent excessive requests/state changes from happening, see
      // #1832 for past bugs
      // XXX: can we mark the formik state as invalid so that submit can't happen before
      // the autocomplete is finished?
      timerRef.current = window.setTimeout(async () => {
        const result = (await getAddressAutoComplete(postcode, houseNumber)) ?? {
          streetName: '',
          city: '',
        };
        const {streetName, city} = result;
        if (!isMounted) return;
        for (const {key, type} of updateableTargets) {
          const newValue = type === 'streetName' ? streetName : city;
          setFieldValue(key, newValue);
        }
      }, LOCATION_AUTOCOMPLETE_DEBOUNCE);
    }

    // cancel the setTimeout on unmount and prevent state updates on unmounted
    // component
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      isMounted = false;
    };
  }, [setFieldValue, getAddressAutoComplete, postcode, houseNumber]);

  return null;
};

export default AddressAutoFillObservers;
