import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';

import Caption from 'components/Caption';
import Card from 'components/Card';
import List from 'components/List';

import MobileButton from './MobileButton';
import ProgressIndicatorItem from './ProgressIndicatorItem';

const ProgressIndicator = ({
  title,
  formTitle,
  steps,
  ariaMobileIconLabel,
  accessibleToggleStepsLabel,
}) => {
  const {pathname: currentPathname} = useLocation();
  const [expanded, setExpanded] = useState(false);

  const modifiers = [];
  if (!expanded) {
    modifiers.push('mobile-collapsed');
  }

  // collapse the expanded progress indicator if nav occurred, see
  // open-formulieren/open-forms#2673. It's important that *only* the pathname triggers
  // the effect, which is why exhaustive deps is ignored.
  useEffect(() => {
    if (expanded) {
      setExpanded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPathname]);

  return (
    <Card blockClassName="progress-indicator" modifiers={modifiers}>
      <nav>
        <MobileButton
          ariaMobileIconLabel={ariaMobileIconLabel}
          accessibleToggleStepsLabel={accessibleToggleStepsLabel}
          formTitle={formTitle}
          expanded={expanded}
          onExpandClick={() => setExpanded(!expanded)}
        />
        <Caption component="h2">{title}</Caption>
        <List ordered>
          {steps.map((step, index) => (
            <ProgressIndicatorItem
              key={`${step.to}-${index}`}
              label={step.label}
              to={step.to}
              isActive={step.isCurrent}
              isCompleted={step.isCompleted}
              canNavigateTo={step.canNavigateTo}
              isApplicable={step.isApplicable}
            />
          ))}
        </List>
      </nav>
    </Card>
  );
};

ProgressIndicator.propTypes = {
  title: PropTypes.node.isRequired,
  formTitle: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      isCompleted: PropTypes.bool,
      isApplicable: PropTypes.bool,
      isCurrent: PropTypes.bool,
      canNavigateTo: PropTypes.bool,
    })
  ).isRequired,
  ariaMobileIconLabel: PropTypes.string.isRequired,
  accessibleToggleStepsLabel: PropTypes.string.isRequired,
};

export default ProgressIndicator;
