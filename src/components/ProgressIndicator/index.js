import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {useLocation} from 'react-router-dom';

import Caption from 'components/Caption';
import Card from 'components/Card';
import List from 'components/List';
import {STEP_LABELS} from 'components/constants';

import MobileButton from './MobileButton';
import ProgressIndicatorItem from './ProgressIndicatorItem';

const ProgressIndicator = ({
  progressIndicatorTitle,
  formTitle,
  steps,
  ariaMobileIconLabel,
  accessibleToggleStepsLabel,
  sticky = true,
}) => {
  const {pathname: currentPathname} = useLocation();
  const [expanded, setExpanded] = useState(false);

  const modifiers = [];
  if (sticky) {
    modifiers.push('sticky');
  }
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
        <Caption component="h2">
          <FormattedMessage
            description="Title of progress indicator"
            defaultMessage="{progressIndicatorTitle}"
            values={{progressIndicatorTitle}}
          />
        </Caption>
        <List ordered>
          {steps.map(step => (
            <ProgressIndicatorItem
              key={step.slug || step.uuid}
              text={step.formDefinition}
              href={step.to}
              isActive={step.isCurrent}
              isCompleted={step.isCompleted}
              canNavigateTo={step.canNavigateTo}
              isApplicable={step.isApplicable}
              fixedText={step.fixedText}
            />
          ))}
        </List>
      </nav>
    </Card>
  );
};

ProgressIndicator.propTypes = {
  progressIndicatorTitle: PropTypes.string.isRequired,
  formTitle: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string,
      slug: PropTypes.string,
      to: PropTypes.string,
      formDefinition: PropTypes.string.isRequired,
      isCompleted: PropTypes.bool,
      isApplicable: PropTypes.bool,
      isCurrent: PropTypes.bool,
      canNavigateTo: PropTypes.bool,
      fixedText: PropTypes.string,
    })
  ).isRequired,
  ariaMobileIconLabel: PropTypes.string.isRequired,
  accessibleToggleStepsLabel: PropTypes.string.isRequired,
  sticky: PropTypes.bool,
};

export default ProgressIndicator;
