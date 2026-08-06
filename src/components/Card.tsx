import {Heading} from '@utrecht/component-library-react';
import {clsx} from 'clsx';

export interface CardTitleProps {
  title: React.ReactNode;
  /**
   * Heading level, mapping to the h1/h2/h3/h4/h5/h6 elements. The default is level 2
   * to avoid accidentally putting multiple "page titles", which people have opinions
   * about. This applies to direct low-level `CardTitle` usage - the `Card` component
   * itself defaults it to level 1.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  padded?: boolean;
}

const CardTitle: React.FC<CardTitleProps> = ({title, headingLevel = 2, padded = false}) => (
  <header className={clsx('openforms-card__header', {'openforms-card__header--padded': padded})}>
    <Heading level={headingLevel} className="openforms-title">
      {title}
    </Heading>
  </header>
);

export interface CardProps {
  /**
   * Title of the card, displayed in separate header.
   */
  title?: React.ReactNode;
  /**
   * The card body content.
   */
  children?: React.ReactNode;
  /**
   * If enabled, the header is hidden on mobile viewports.
   */
  mobileHeaderHidden?: boolean;
  variant?: 'spaced-children';
}

const Card: React.FC<CardProps & Omit<React.ComponentPropsWithoutRef<'div'>, 'title'>> = ({
  title,
  children,
  mobileHeaderHidden = false,
  variant,
  ...restProps
}) => {
  const modifiers = [];
  if (mobileHeaderHidden) modifiers.push('mobile-header-hidden');

  const className = clsx(
    'openforms-card',
    modifiers.map(mod => `openforms-card--${mod}`),
    variant && `openforms-card--${variant}`
  );
  return (
    <div className={className} {...restProps}>
      {/* Emit header/title only if there is one */}
      {title && <CardTitle title={title} headingLevel={1} />}
      {title ? <div className="openforms-card__body"> {children} </div> : children}
    </div>
  );
};

export default Card;
export {CardTitle};
