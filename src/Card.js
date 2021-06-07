import React from 'react';
import PropTypes from 'prop-types';

import {applyPrefix} from './formio/utils';
import Caption from './Caption';


const CardTitle = ({ title, component='h2' }) => {
  const Title = `${component}`;
  return (
    <header className={applyPrefix('card__header')}>
      <Title className={applyPrefix('title')}>{title}</Title>
    </header>
  );
}

CardTitle.propTypes = {
  title: PropTypes.string.isRequired,
  component: PropTypes.string,
};

const Card = ({ children, title, titleComponent, caption }) => {
  return (
    <div className={applyPrefix('card')}>
      {/* Emit header/title only if there is one */}
      { title ? <CardTitle title={title} component={titleComponent} /> : null }

      {/* Emit the caption if provided */}
      { caption ? <Caption component="h3">{caption}</Caption> : null }

      { title
        ? <div className={applyPrefix('card__body')}> {children} </div>
        : children }

    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  caption: PropTypes.string,
  children: PropTypes.node,
  titleComponent: PropTypes.string,
};


export default Card;
