import {
  DataList,
  DataListItem,
  DataListKey,
  DataListValue,
  Heading2,
} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import React, {useId} from 'react';
import {FormattedMessage} from 'react-intl';

import FAIcon from 'components/FAIcon';
import Link from 'components/Link';

import ComponentValueDisplay from './ComponentValueDisplay';

// Components without a label that should still be displayed
const COMPONENTS_WITH_NO_NAME = ['content'];

const LabelValueRow = ({name, value, component}) => {
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

LabelValueRow.propTypes = {
  name: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
    PropTypes.bool,
  ]),
  component: PropTypes.object.isRequired,
};

const FormStepSummary = ({editUrl, name, data, editStepText = ''}) => {
  const linkDescriptionId = useId();
  return (
    <div className="openforms-summary">
      <div className="openforms-summary__header">
        <Heading2 className="utrecht-heading-2--openforms-summary-step-name">{name}</Heading2>

        {editStepText && (
          <>
            <span className="openforms-summary__link-description" id={linkDescriptionId}>
              <FormattedMessage
                description="Form step change link accessible description"
                defaultMessage="Change fields in form step ''{name}''"
                values={{name}}
              />
            </span>

            <Link to={editUrl} aria-describedby={linkDescriptionId}>
              <FAIcon icon="pen-to-square" />
              {editStepText}
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

FormStepSummary.propTypes = {
  name: PropTypes.node.isRequired,
  editUrl: PropTypes.string.isRequired,
  editStepText: PropTypes.node,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export {LabelValueRow};
export default FormStepSummary;
