import {Heading} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';

import Caption from 'components/Caption';
import {getBEMClassName} from 'utils';

const CardTitle = ({
  title,
  component = 'h1',
  headingType = 'title',
  blockClassName = 'card',
  modifiers = [],
}) => {
  const headingLevel = {
    h1: 1,
    h2: 2,
    h3: 3,
    h4: 4,
    h5: 5,
    h6: 6,
  };

  return (
    <header className={getBEMClassName(`${blockClassName}__header`, modifiers)}>
      <Heading level={headingLevel[component] || 1} className={getBEMClassName(headingType)}>
        {title}
      </Heading>
    </header>
  );
};

CardTitle.propTypes = {
  title: PropTypes.node.isRequired,
  component: PropTypes.string,
  blockClassName: PropTypes.string,
  headingType: PropTypes.oneOf(['title', 'subtitle']),
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(['padded'])),
};

const Card = ({
  children,
  title,
  titleComponent,
  titleHeadingType = 'title',
  caption,
  captionComponent,
  blockClassName = 'card',
  modifiers = [],
  ...props
}) => {
  const className = getBEMClassName(blockClassName, modifiers);
  return (
    <div className={className} {...props}>
      {/* Emit header/title only if there is one */}
      {title ? (
        <CardTitle
          title={title}
          component={titleComponent}
          headingType={titleHeadingType}
          blockClassName={blockClassName}
        />
      ) : null}

      {/* Emit the caption if provided */}
      {caption ? <Caption component={captionComponent}>{caption}</Caption> : null}

      {title ? (
        <div className={getBEMClassName(`${blockClassName}__body`)}> {children} </div>
      ) : (
        children
      )}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.node,
  /**
   * Alternative HTML element to render, the default is h1.
   */
  titleComponent: PropTypes.string,
  titleHeadingType: PropTypes.oneOf(['title', 'subtitle']),
  caption: PropTypes.string,
  captionComponent: PropTypes.string,
  children: PropTypes.node,
  blockClassName: PropTypes.string,
  modifiers: PropTypes.arrayOf(PropTypes.string),
};

export default Card;
export {CardTitle};
