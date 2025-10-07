import type {
  AddressData,
  AddressNLComponentSchema,
  AnyComponentSchema,
  CheckboxComponentSchema,
  ContentComponentSchema,
  CosignV1ComponentSchema,
  CurrencyComponentSchema,
  DateComponentSchema,
  DateTimeComponentSchema,
  FileComponentSchema,
  FileUploadData,
  MapComponentSchema,
  NumberComponentSchema,
  RadioComponentSchema,
  SelectComponentSchema,
  SelectboxesComponentSchema,
  SignatureComponentSchema,
  TimeComponentSchema,
} from '@open-formulieren/types';
import type {JSONValue} from '@open-formulieren/types/lib/types';
import React, {Suspense} from 'react';
import {FormattedDate, FormattedMessage, FormattedNumber, FormattedTime} from 'react-intl';

import Anchor from '@/components/Anchor';
import Body from '@/components/Body';
import CoSignOld from '@/components/CoSign';
import Image from '@/components/Image';
import List from '@/components/List';
import Loader from '@/components/Loader';
import Map from '@/components/Map';
import type {GeoJsonGeometry} from '@/components/Map/types';

export interface DisplayProps<S, V> {
  component: S;
  value: V | undefined;
}

const EmptyDisplay: React.FC = () => '';

const DefaultDisplay: React.FC<DisplayProps<AnyComponentSchema, JSONValue>> = ({value}) => {
  if (value == null) return '';
  if (value === '') return <EmptyDisplay />;
  return value.toString();
};

const SignatureDisplay: React.FC<DisplayProps<SignatureComponentSchema, string>> = ({
  component,
  value,
}) => {
  if (!value) {
    return <EmptyDisplay />;
  }
  return <Image src={value} alt={component.key} />;
};

const CheckboxDisplay: React.FC<DisplayProps<CheckboxComponentSchema, boolean>> = ({value}) => {
  if (value) {
    return <FormattedMessage description="'True' display" defaultMessage="Yes" />;
  }
  return <FormattedMessage description="'False' display" defaultMessage="No" />;
};

const RadioDisplay: React.FC<DisplayProps<RadioComponentSchema, string>> = ({component, value}) => {
  if (!value) {
    return <EmptyDisplay />;
  }
  if (!('values' in component)) return value;
  const obj = component.values.find(obj => obj.value === value);
  return obj ? obj.label : value;
};

const SelectDisplay: React.FC<DisplayProps<SelectComponentSchema, string>> = ({
  component,
  value,
}) => {
  if (!value) {
    return <EmptyDisplay />;
  }
  if (!('data' in component)) return value;
  const obj = component.data.values.find(obj => obj.value === value);
  return obj ? obj.label : value;
};

const DateDisplay: React.FC<DisplayProps<DateComponentSchema, string>> = ({value}) => {
  if (!value) return <EmptyDisplay />;
  const [year, month, day] = value.split('-');
  const date = new Date();
  date.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day));
  return <FormattedDate value={date} />;
};

const DateTimeDisplay: React.FC<DisplayProps<DateTimeComponentSchema, string>> = ({value}) => {
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

const TimeDisplay: React.FC<DisplayProps<TimeComponentSchema, string>> = ({value}) => {
  if (!value) return <EmptyDisplay />;
  // value may be a full ISO-8601 date
  let time = new Date(value);
  // Invalid date (which is instanceof Date, but also NaN)
  if (isNaN(Number(time))) {
    const [hours, minutes, seconds] = value.split(':');
    time = new Date();
    time.setHours(parseInt(hours));
    time.setMinutes(parseInt(minutes));
    time.setSeconds(parseInt(seconds));
  }
  return <FormattedTime value={time} />;
};

const SelectboxesDisplay: React.FC<
  DisplayProps<SelectboxesComponentSchema, Record<string, boolean>>
> = ({component, value}) => {
  if (!value) {
    return <EmptyDisplay />;
  }

  const selectedBoxes = Object.keys(value).filter(key => value[key] === true);
  if (!selectedBoxes.length || !('values' in component)) {
    return <EmptyDisplay />;
  }

  const selectedObjs = component.values.filter(obj => selectedBoxes.includes(obj.value));
  const selectedLabels = selectedObjs.map(selectedLabel => selectedLabel.label);
  return (
    <List extraCompact withDash>
      {selectedLabels.map((label, i) => (
        <Body key={i} component="span">
          {label}
        </Body>
      ))}
    </List>
  );
};

interface HumanFileSize {
  size: number;
  unit: 'byte' | 'kilobyte' | 'megabyte' | 'gigabyte' | 'terabyte';
}

/**
 * Takes a file size in bytes and returns the appropriate human readable value + unit
 * to use.
 */
const humanFileSize = (size: number): HumanFileSize => {
  if (size === 0) {
    return {size: 0, unit: 'byte'};
  }
  const index = Math.floor(Math.log(size) / Math.log(1024));
  const newSize = parseFloat((size / Math.pow(1024, index)).toFixed(2));
  const unit = (['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'] as const)[index];
  return {size: newSize, unit};
};

const FileDisplay: React.FC<DisplayProps<FileComponentSchema, FileUploadData>> = ({
  component,
  value,
}) => {
  // Case where no file was uploaded
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return <EmptyDisplay />;
  }

  // Normalize in case we get an array for a single value, which is what Formio actually
  // does.
  if (!component.multiple && Array.isArray(value)) {
    value = value[0] as FileUploadData;
  }

  const {url, size: sizeInBytes, originalName} = value;
  const {size, unit} = humanFileSize(sizeInBytes);

  return (
    <Anchor key={url} href={url}>
      {originalName}
      (<FormattedNumber value={size} style="unit" unit={unit} />)
    </Anchor>
  );
};

const NumberDisplay: React.FC<DisplayProps<NumberComponentSchema, number>> = ({
  component,
  value,
}) => {
  if (!value && value !== 0) return <EmptyDisplay />;

  return <FormattedNumber value={value} maximumFractionDigits={component.decimalLimit} />;
};

const PartnersDisplay: React.FC = () => {
  // the partners data is handled in the backend, so we do not want to show it twice
  return <EmptyDisplay />;
};

const ChildrenDisplay: React.FC = () => {
  // the children data is handled in the backend, so we do not want to show it twice
  return <EmptyDisplay />;
};

const CurrencyDisplay: React.FC<DisplayProps<CurrencyComponentSchema, number>> = ({
  component,
  value,
}) => {
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

const MapDisplay: React.FC<DisplayProps<MapComponentSchema, GeoJsonGeometry>> = ({
  component,
  value,
}) => {
  if (!value) {
    return <EmptyDisplay />;
  }

  return (
    <Suspense fallback={<Loader modifiers={['centered']} />}>
      <Map geoJsonGeometry={value} disabled tileLayerUrl={component.tileLayerUrl} />
    </Suspense>
  );
};

const CoSignDisplay: React.FC<DisplayProps<CosignV1ComponentSchema, unknown>> = ({value}) => {
  if (!value) {
    return <EmptyDisplay />;
  }
  return <CoSignOld interactive={false} />;
};

const AddressNLDisplay: React.FC<DisplayProps<AddressNLComponentSchema, AddressData>> = ({
  component,
  value,
}) => {
  if (!value || Object.values(value).every(v => v === '')) {
    return <EmptyDisplay />;
  }

  if (component.deriveAddress && value.city) {
    return (
      <address>
        {value.streetName} {value.houseNumber}
        {value.houseLetter} {value.houseNumberAddition}
        <>
          <br />
          {value.postcode} {value.city}
        </>
      </address>
    );
  }

  return (
    <address>
      {value.postcode} {value.houseNumber}
      {value.houseLetter} {value.houseNumberAddition}
    </address>
  );
};

const ContentDisplay: React.FC<DisplayProps<ContentComponentSchema, never>> = ({component}) => {
  return <span dangerouslySetInnerHTML={{__html: component.html}} />;
};

const FieldsetDisplay: React.FC = () => {
  return <EmptyDisplay />;
};

const ComponentValueDisplay: React.FC<DisplayProps<AnyComponentSchema, JSONValue>> = ({
  component,
  value,
}) => {
  const {type} = component;
  const multiple = 'multiple' in component ? component.multiple : false;

  if (value == null) {
    return <EmptyDisplay />;
  }

  const Formatter = TYPE_TO_COMPONENT[type] || DefaultDisplay;

  if (multiple) {
    const values = Array.isArray(value) ? value : [value];
    const renderedValues = values.map((componentValue, index) => (
      <Formatter key={index} component={component} value={componentValue} />
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

// mapping of Formio types to respective React components
const TYPE_TO_COMPONENT: Partial<
  Record<AnyComponentSchema['type'], React.FC<DisplayProps<AnyComponentSchema, unknown>>>
> = {
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
  coSign: CoSignDisplay,
  addressNL: AddressNLDisplay,
  content: ContentDisplay,
  fieldset: FieldsetDisplay,
  partners: PartnersDisplay,
  children: ChildrenDisplay,
};

export default ComponentValueDisplay;
