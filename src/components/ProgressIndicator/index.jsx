import PropTypes from 'prop-types';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';

import Caption from 'components/Caption';
import Card from 'components/Card';
import List from 'components/List';
import useWindowResize from 'hooks/useWindowResize';

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
  const [verticalSpaceUsed, setVerticalSpaceUsed] = useState(null);
  const [resizeCounter, setResizeCounter] = useState(0);
  const buttonRef = useRef(null);

  const modifiers = [];
  if (expanded) {
    modifiers.push('expanded');
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

  useLayoutEffect(() => {
    let isMounted = true;
    if (buttonRef.current) {
      const boundingBox = buttonRef.current.getBoundingClientRect();
      // the offset from top + height of the element (including padding + borders)
      isMounted && setVerticalSpaceUsed(boundingBox.bottom);
    }
    return () => {
      isMounted = false;
    };
  }, [buttonRef, setVerticalSpaceUsed, resizeCounter]);
  useWindowResize(() => {
    setResizeCounter(prev => prev + 1);
  });

  const customProperties = verticalSpaceUsed
    ? {
        '--_of-progress-indicator-nav-mobile-inset-block-start': `${verticalSpaceUsed}px`,
      }
    : undefined;
  return (
    <Card blockClassName="progress-indicator" modifiers={modifiers} style={customProperties}>
      <MobileButton
        ref={buttonRef}
        ariaMobileIconLabel={ariaMobileIconLabel}
        accessibleToggleStepsLabel={accessibleToggleStepsLabel}
        formTitle={formTitle}
        expanded={expanded}
        onExpandClick={() => setExpanded(!expanded)}
      />

      <nav
        className="openforms-progress-indicator__nav"
        aria-labelledby="ca10ead3-1537-41dc-b3b4-a4593740ecd9"
      >
        <Caption component="h2" id="ca10ead3-1537-41dc-b3b4-a4593740ecd9">
          {title}
        </Caption>
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
