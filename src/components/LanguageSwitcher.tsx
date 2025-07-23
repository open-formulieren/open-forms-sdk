import {useContext} from 'react';
import ReactDOM from 'react-dom';

import LanguageSelection from '@/components/LanguageSelection';
import {I18NContext} from '@/i18n';

const LanguageSwitcher: React.FC = () => {
  const {languageSelectorTarget: target} = useContext(I18NContext);
  return target ? ReactDOM.createPortal(<LanguageSelection />, target) : <LanguageSelection />;
};

export default LanguageSwitcher;
