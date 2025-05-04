import clsx from 'clsx';
import L from 'leaflet';
import {createRef, useEffect, useState} from 'react';
import {useMap} from 'react-leaflet';

interface ControlProps {
  position: L.ControlPosition;
  children: React.ReactNode;
}

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
};

const LeafletControl: React.FC<ControlProps> = ({position, children}) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement>(document.createElement('div'));
  const controlContainerRef = createRef<HTMLDivElement>();
  const map = useMap();

  /**
   * Whenever the control container ref is created, ensure the click/scroll propagation
   * is removed. This way click/scroll events do not bubble down to the map.
   */
  useEffect(() => {
    if (controlContainerRef.current !== null) {
      L.DomEvent.disableClickPropagation(controlContainerRef.current);
      L.DomEvent.disableScrollPropagation(controlContainerRef.current);
    }
  }, [controlContainerRef]);

  /**
   * Mount the component to the position container of the map component.
   */
  useEffect(() => {
    const mapContainer = map.getContainer();
    const targetDiv = mapContainer.getElementsByClassName(POSITION_CLASSES[position]);
    setPortalRoot(targetDiv[0] as HTMLElement);
  }, [map, position]);

  /**
   * Whenever the portal root is complete, append the control container to the portal
   * root.
   */
  useEffect(() => {
    if (portalRoot && controlContainerRef.current) {
      portalRoot.append(controlContainerRef.current);
    }
  }, [controlContainerRef, portalRoot]);

  return (
    <div ref={controlContainerRef} className="leaflet-bar leaflet-draw-toolbar leaflet-control">
      {children}
    </div>
  );
};

interface LeafletControlButtonProps {
  onClick: () => void;
  disabled?: boolean;
  extraClassName?: string;
  ariaLabel: string;
  ariaContent: string;
}

const LeafletControlButton: React.FC<LeafletControlButtonProps> = ({
  onClick,
  disabled,
  extraClassName,
  ariaLabel,
  ariaContent,
}) => {
  return (
    <>
      {/* The leaflet styling rules need this to be an anchor element */}
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        href="#"
        onClick={onClick}
        className={clsx(
          'leaflet-control-button',
          {
            'leaflet-disabled': disabled,
          },
          extraClassName
        )}
        aria-disabled={disabled}
        aria-label={ariaLabel}
      >
        <span className="sr-only">{ariaContent}</span>
      </a>
    </>
  );
};

export default LeafletControl;
export {LeafletControl, LeafletControlButton};
