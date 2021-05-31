import React from 'react';
import PropTypes from 'prop-types';


const Card = ({ title, children, titleComponent='h2' }) => {
  const Title = `${titleComponent}`;

  return (
    <div className="card">
      <header className="card__header">
        <Title className="title">{title}</Title>
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
