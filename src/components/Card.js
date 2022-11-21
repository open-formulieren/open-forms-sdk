import React from 'react';
import PropTypes from 'prop-types';

import Caption from 'components/Caption';
import { getBEMClassName } from 'utils';
import { Heading } from '@utrecht/component-library-react';


const CardTitle = ({ title, component='h2', blockClassName='card' }) => {
  const headingLevel = {
    'h1': 1,
    'h2': 2,
    'h3': 3,
    'h4': 4,
    'h5': 5,
    'h6': 6,
  };

  return (
    <header className={getBEMClassName(`${blockClassName}__header`)}>
      <Heading level={headingLevel[component] || 1} className={getBEMClassName('title')}>{title}</Heading>
    </header>
  );
}

CardTitle.propTypes = {
  title: PropTypes.node.isRequired,
  component: PropTypes.string,
  blockClassName: PropTypes.string,
};

const Card = ({ children, title, titleComponent, caption, captionComponent, blockClassName='card', modifiers=[] }) => {
  const className = getBEMClassName(
    blockClassName,
    modifiers,
  );
  return (
    <div className={className}>
      {/* Emit header/title only if there is one */}
      { title ? <CardTitle title={title} component={titleComponent} blockClassName={blockClassName} /> : null }

      {/* Emit the caption if provided */}
      { caption ? <Caption component={captionComponent}>{caption}</Caption> : null }

      { title
        ? <div className={getBEMClassName(`${blockClassName}__body`)}> {children} </div>
        : children }

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
