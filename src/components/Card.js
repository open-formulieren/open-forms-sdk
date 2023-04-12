import {Heading} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import React from 'react';

import Caption from 'components/Caption';
import {getBEMClassName} from 'utils';

const CardTitle = ({title, component = 'h1', headingType = 'title', blockClassName = 'card'}) => {
  const headingLevel = {
    h1: 1,
    h2: 2,
    h3: 3,
    h4: 4,
    h5: 5,
    h6: 6,
  };

  return (
    <header className={getBEMClassName(`${blockClassName}__header`)}>
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
}) => {
  const className = getBEMClassName(blockClassName, modifiers);
  return (
    <div className={className}>
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
  caption: PropTypes.string,
  children: PropTypes.node,
  titleComponent: PropTypes.string,
  captionComponent: PropTypes.string,
  blockClassName: PropTypes.string,
  modifiers: PropTypes.arrayOf(PropTypes.string),
};

export default Card;
export {CardTitle};
