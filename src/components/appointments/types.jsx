import PropTypes from 'prop-types';

export const ProductsType = PropTypes.arrayOf(
  PropTypes.shape({
    productId: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  })
);
