import {FormattedDate, FormattedRelativeTime, useIntl} from 'react-intl';
import {useState as useGlobalState} from 'state-pool';

import {sessionExpiresAt} from '@/api';
import {getVersion} from '@/utils';

export interface DebugInfoProps {
  label: string;
  value?: string;
  children?: React.ReactNode;
}

const DebugInfo: React.FC<DebugInfoProps> = ({label, value, children}) => (
  <div className="debug-info">
    <div className="debug-info__label">{label}</div>
    <div className="debug-info__value">{value ?? children}</div>
  </div>
);

const AppDebug: React.FC = () => {
  const {locale} = useIntl();
  const [{expiry}] = useGlobalState(sessionExpiresAt);
  return (
    <div className="debug-info-container" title="Debug information (only available in dev)">
      <DebugInfo label="Current locale" value={locale} />
      <DebugInfo label="Session expires at">
        {expiry ? (
          <>
            <FormattedDate value={expiry} hour="numeric" minute="numeric" second="numeric" />
            &nbsp;(
            <FormattedRelativeTime
              value={(expiry.getTime() - new Date().getTime()) / 1000}
              numeric="auto"
              updateIntervalInSeconds={1}
            />
            )
          </>
        ) : (
          '-'
        )}
      </DebugInfo>
      <DebugInfo label="SDK version">{getVersion()}</DebugInfo>
    </div>
  );
};

export default AppDebug;
