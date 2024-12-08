import PropTypes from 'prop-types';
import React, {useContext} from 'react';

import {DEBUG} from 'utils';

const LiteralContext = React.createContext();
LiteralContext.displayName = 'LiteralContext';

const LiteralsProvider = ({literals, children}) => (
  <LiteralContext.Provider value={literals}>{children}</LiteralContext.Provider>
);

LiteralsProvider.propTypes = {
  literals: PropTypes.objectOf(
    PropTypes.shape({
      resolved: PropTypes.string.isRequired,
      value: PropTypes.string,
    })
  ).isRequired,
};

const EMPTY_LITERAL = {resolved: ''};

const Literal = ({name}) => {
  const literals = useContext(LiteralContext);
  const value = (literals[name] || EMPTY_LITERAL).resolved;
  if (DEBUG && !value) {
    console.warn(`Literal ${name} not found!`);
  }
  return value;
};

Literal.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Literal;
export {LiteralsProvider, Literal};
