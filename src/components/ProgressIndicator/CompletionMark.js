import PropTypes from 'prop-types';
import React from 'react';

import FAIcon from 'components/FAIcon';

const CompletionMark = ({completed = false}) => {
  if (!completed) return null;
  return <FAIcon icon="check" modifiers={['small']} aria-hidden="true" />;
};

CompletionMark.propTypes = {
  completed: PropTypes.bool,
};

export default CompletionMark;
