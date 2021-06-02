import React from 'react';
import PropTypes from 'prop-types';

import {applyPrefix} from './formio/utils';


const Card = ({ title, children, titleComponent='h2' }) => {
  const Title = `${titleComponent}`;

  return (
    <div className="card">
      <header className="card__header">
        <Title className={applyPrefix('title')}>{title}</Title>
      </header>

      <div className="card__body">
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
