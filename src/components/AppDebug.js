import {useIntl} from 'react-intl';
import {useGlobalState} from 'state-pool';
import {FormattedDate, FormattedRelativeTime} from 'react-intl';

import {sessionExpiresAt} from 'api';

const DebugInfo = ({label, value, children}) => (
  <div className="debug-info">
    <div className="debug-info__label">{label}</div>
    <div className="debug-info__value">{value ?? children}</div>
  </div>
);

const AppDebug = () => {
  const {locale} = useIntl();
  const [{expiry}] = useGlobalState(sessionExpiresAt);
  const expiryDelta = (expiry - new Date()) / 1000;
  return (
    <div className="debug-info-container" title="Debug information (only available in dev)">
      <DebugInfo label="Current locale" value={locale} />
      <DebugInfo label="Session expires at">
        <FormattedDate value={expiry} hour="numeric" minute="numeric" second="numeric" />
        &nbsp;(
        <FormattedRelativeTime value={expiryDelta} numeric="auto" updateIntervalInSeconds={1} />)
      </DebugInfo>
    </div>
  );
};

export default AppDebug;
