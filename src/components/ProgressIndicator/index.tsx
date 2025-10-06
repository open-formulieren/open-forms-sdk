import clsx from 'clsx';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router';

import Caption from '@/components/Caption';
import List from '@/components/List';
import useWindowResize from '@/hooks/useWindowResize';

import MobileButton from './MobileButton';
import ProgressIndicatorItem from './ProgressIndicatorItem';
import type {StepMeta} from './utils';

export interface ProgressIndicatorProps {
  title: React.ReactNode;
  formTitle: string;
  steps: StepMeta[];
  ariaMobileIconLabel: string;
  accessibleToggleStepsLabel: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  title,
  formTitle,
  steps,
  ariaMobileIconLabel,
  accessibleToggleStepsLabel,
}) => {
  const {pathname: currentPathname} = useLocation();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [verticalSpaceUsed, setVerticalSpaceUsed] = useState<number | null>(null);
  const [resizeCounter, setResizeCounter] = useState<number>(0);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

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
      if (isMounted) setVerticalSpaceUsed(boundingBox.bottom);
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
    <div
      className={clsx('openforms-progress-indicator', {
        'openforms-progress-indicator--expanded': expanded,
      })}
      style={customProperties}
    >
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
    </div>
  );
};

export default ProgressIndicator;
