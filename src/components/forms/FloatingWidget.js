/**
 * Implements a form field widget that floats in a 'popout'.
 *
 * Focusing the form field opens the widget, while keeping focus on original form
 * field. Keyboard tab navigation focuses the elements inside the popout in order,
 * while any other keyboard input closes the widget (shifting to 'manual input' mode).
 *
 * Clicking the form field/reference (re-)opens the widget. The widget/popout can be
 * dismissed by hitting the [ESC} key, clicking outside of it or tabbing through/out
 * of it.
 *
 * You need both the hook and component for the behaviour.
 *
 * Note that `getReferenceProps` returns event handlers like onKeyDown - if you are
 * overriding these events yourself, make sure you don't accidentally overwrite the
 * floating widget handlers.
 */
import {
  FloatingArrow,
  FloatingFocusManager,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import PropTypes from 'prop-types';
import React, {useRef, useState} from 'react';

import {getBEMClassName} from 'utils';

const useFloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const keepClosed = useRef(false);
  const arrowRef = useRef(null);

  const manageOpen = (open, options = {}) => {
    const {keepDismissed = false} = options;
    setIsOpen(open);
    if (open && keepClosed.current) {
      keepClosed.current = false;
    }
    if (!open && keepDismissed) {
      keepClosed.current = true;
    }
  };

  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: manageOpen,
    middleware: [offset(10), flip(), shift(), arrow({element: arrowRef})],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const role = useRole(context);

  const {getReferenceProps, getFloatingProps} = useInteractions([dismiss, role]);
  const referenceProps = getReferenceProps();

  const onClick = () => {
    const isFocused = context.refs.reference.current === document.activeElement;
    isFocused && !isOpen && manageOpen(true);
  };

  const onKeyDown = event => {
    referenceProps?.onKeyDown?.(event);
    event.key !== 'Tab' && manageOpen(false);
  };

  const onFocus = () => {
    !isOpen && !keepClosed.current && manageOpen(true);
    if (keepClosed.current) {
      keepClosed.current = false;
    }
  };

  return {
    refs,
    floatingStyles,
    context,
    getFloatingProps,
    getReferenceProps: () => {
      return {...referenceProps, onClick, onFocus, onKeyDown};
    },
    isOpen,
    setIsOpen: manageOpen,
    arrowRef,
  };
};

const FloatingWidget = ({
  isOpen,
  context,
  setFloating,
  floatingStyles,
  getFloatingProps,
  arrowRef,
  children,
  ...restProps
}) => {
  return (
    isOpen && (
      <FloatingFocusManager
        context={context}
        modal={false}
        order={['reference', 'content']}
        returnFocus
        visuallyHiddenDismiss
      >
        <div
          ref={setFloating}
          className={getBEMClassName('floating-widget')}
          // checked with CSP - these inline styles appear to be using the CSSOM correctly
          // and would not result in CSP violations where unsafe-inline is blocked.
          // Ref: https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model
          style={floatingStyles}
          {...getFloatingProps()}
          {...restProps}
        >
          <FloatingArrow
            ref={arrowRef}
            context={context}
            className={getBEMClassName('floating-widget__arrow')}
            stroke="transparent"
            strokeWidth={1}
          />
          {children}
        </div>
      </FloatingFocusManager>
    )
  );
};

FloatingWidget.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  context: PropTypes.object.isRequired,
  setFloating: PropTypes.func.isRequired,
  floatingStyles: PropTypes.object.isRequired,
  getFloatingProps: PropTypes.func.isRequired,
  arrowRef: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export {useFloatingWidget, FloatingWidget};
