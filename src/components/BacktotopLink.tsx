import {Icon} from '@utrecht/component-library-react';
import {useContext} from 'react';

import {ConfigContext} from '@/Context';
import Anchor from '@/components/Anchor';
import FAIcon from '@/components/FAIcon';

const BacktotopLink: React.FC = () => {
  const {backToTopText, backToTopRef} = useContext(ConfigContext);

  return (
    !!backToTopText &&
    backToTopRef && (
      <Anchor href={`#${backToTopRef}`} className="openforms-backtotop-link">
        <Icon>
          <FAIcon icon="" className="fa-fw" />
        </Icon>
        {backToTopText}
      </Anchor>
    )
  );
};

export default BacktotopLink;
