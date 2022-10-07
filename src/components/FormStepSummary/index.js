import React from 'react';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';
import ComponentValueDisplay from 'components/FormStepSummary/ComponentValueDisplay';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import Caption from 'components/Caption';
import Button from 'components/Button';



const LabelValueRow = ({name, value, component}) => {
  if (!name) {
    return null;
  }

  const className = getBEMClassName('summary-row', [component.type]);
  return (
    <div className={className}>
      <div className={getBEMClassName('summary-row__label')}>{name}</div>
      <div className={getBEMClassName('summary-row__value')}>
        <ComponentValueDisplay value={value} component={component} />
      </div>
    </div>
  );
};

LabelValueRow.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool]),
  component: PropTypes.object.isRequired,
};


const FormStepSummary = ({slug, name, data, editStepText}) => {
  const editStepUrl = `/stap/${slug}`;
  const history = useHistory();

    return (
      <>
        <Toolbar modifiers={['compact', 'underlined', 'margin-bottom']}>
          <ToolbarList>
            <Caption component={'span'}>{name}</Caption>
          </ToolbarList>
          <ToolbarList>
            <Button
              variant="anchor"
              component="a"
              href={editStepUrl}
              onClick={(event) => {
                event.preventDefault();
                history.push(editStepUrl);
              }}
            >
              {editStepText}
            </Button>
          </ToolbarList>
        </Toolbar>

        <div className={getBEMClassName('step-summary')}>
          {
            data.map((item, index) => (
              <LabelValueRow
                key={index}
                name={item.name}
                value={item.value}
                component={item.component}
              />
            ))
          }
        </div>
      </>
    );
  };

FormStepSummary.propTypes = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  editStepText: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export {LabelValueRow};
export default FormStepSummary;
