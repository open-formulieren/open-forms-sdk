import React from 'react';
import PropTypes from 'prop-types';

import {applyPrefix} from './formio/utils';


const Card = ({ title, children, titleComponent='h2' }) => {
  const Title = `${titleComponent}`;

  return (
    <div className={applyPrefix('card')}>
      <header className={applyPrefix('card__header')}>
        <Title className={applyPrefix('title')}>{title}</Title>
      </header>

      <div className={applyPrefix('card__body')}>
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  titleComponent: PropTypes.string,
};


export default Card;
