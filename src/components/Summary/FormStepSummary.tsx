import type {AnyComponentSchema} from '@open-formulieren/types';
import type {JSONValue} from '@open-formulieren/types';
import {
  DataList,
  DataListItem,
  DataListKey,
  DataListValue,
  Heading2,
} from '@utrecht/component-library-react';
import {useId} from 'react';
import {FormattedMessage} from 'react-intl';

import ComponentValueDisplay from '@/components/ComponentValueDisplay';
import FAIcon from '@/components/FAIcon';
import Link from '@/components/Link';
import type {StepSummaryData} from '@/data/submissions';

// Components without a label that should still be displayed
const COMPONENTS_WITH_NO_NAME: AnyComponentSchema['type'][] = ['content'];

export interface LabelValueRowProps {
  name: React.ReactNode;
  value: JSONValue | undefined;
  component: AnyComponentSchema;
}

// Exported because there are (unit) tests
export const LabelValueRow: React.FC<LabelValueRowProps> = ({name, value, component}) => {
  if (!name && !COMPONENTS_WITH_NO_NAME.includes(component.type)) {
    return null;
  }

  return (
    <DataListItem className={`utrecht-data-list__item--openforms-${component.type}`}>
      <DataListKey>{name}</DataListKey>
      <DataListValue notranslate multiline={['textarea'].includes(component.type)}>
        <ComponentValueDisplay value={value} component={component} />
      </DataListValue>
    </DataListItem>
  );
};

export type FormStepSummaryEditProps =
  | {
      blockEdit?: false;
      /**
       * Route to the step to modify it.
       */
      editUrl: string;
      /**
       * Label of the link to edit the step data.
       */
      editStepText: React.ReactNode;
    }
  | {
      blockEdit: true;
      editUrl?: never;
      editStepText?: never;
    };

export interface FormStepSummaryProps {
  /**
   * Step name, used as heading.
   */
  name: React.ReactNode;
  /**
   * The array of label/value + context items of the fields within the step.
   */
  data: StepSummaryData['data'];
}

/**
 * Display the title of the step, an edit link (optionally) and the values of the
 * submitted form fields in the step.
 *
 * This display helps the user double check that what they entered is correct, before
 * they finally submit it to the backend.
 */
const FormStepSummary: React.FC<FormStepSummaryProps & FormStepSummaryEditProps> = ({
  name,
  data,
  ...props
}) => {
  const linkDescriptionId = useId();
  return (
    <div className="openforms-summary">
      <div className="openforms-summary__header">
        <Heading2 className="utrecht-heading-2--openforms-summary-step-name">{name}</Heading2>

        {!props.blockEdit && (
          <>
            <span className="openforms-summary__link-description" id={linkDescriptionId}>
              <FormattedMessage
                description="Form step change link accessible description"
                defaultMessage="Change fields in form step ''{name}''"
                values={{name}}
              />
            </span>

            <Link to={props.editUrl} aria-describedby={linkDescriptionId}>
              <FAIcon icon="pen-to-square" />
              {props.editStepText}
            </Link>
          </>
        )}
      </div>

      <DataList className="utrecht-data-list--openforms">
        {data.map((item, index) => (
          <LabelValueRow
            key={index}
            name={item.name}
            value={item.value}
            component={item.component}
          />
        ))}
      </DataList>
    </div>
  );
};

export default FormStepSummary;
