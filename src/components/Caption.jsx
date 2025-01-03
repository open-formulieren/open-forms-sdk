import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';

const Caption = ({children, component = 'caption', ...props}) => {
  const Component = `${component}`;
  return (
    <Component className={getBEMClassName('caption')} {...props}>
      {children}
    </Component>
  );
};

Caption.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Caption;
