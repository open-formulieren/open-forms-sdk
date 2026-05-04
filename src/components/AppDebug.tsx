import type {JSONObject} from '@open-formulieren/types';
import React, {useCallback, useContext, useState} from 'react';
import {FormattedDate, FormattedRelativeTime, useIntl} from 'react-intl';
import {useMatch} from 'react-router';
import {useState as useGlobalState} from 'state-pool';

import {FormContext} from '@/Context';
import {sessionExpiresAt} from '@/api';
import type {LogicRule} from '@/data/logic';
import {getVersion} from '@/utils';

interface DebugContextType {
  stepValues: JSONObject | null;
  setStepValues: (values: JSONObject | null, isInitialLoad?: boolean) => void;
  requiresBackendLogic: boolean | null;
  setRequiresBackendLogic: (value: boolean | null) => void;
  logicRules: LogicRule[] | null;
  setLogicRules: (rules: LogicRule[] | null) => void;
}

const DebugContext = React.createContext<DebugContextType>({
  stepValues: null,
  setStepValues: () => {},
  requiresBackendLogic: null,
  setRequiresBackendLogic: () => {},
  logicRules: null,
  setLogicRules: () => {},
});
DebugContext.displayName = 'DebugContext';

export const DebugContextProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const {type} = useContext(FormContext);
  const [stepValues, setStepValues] = useState<JSONObject | null>(null);
  const [requiresBackendLogic, setRequiresBackendLogic] = useState<boolean | null>(null);
  const [logicRules, setLogicRules] = useState<LogicRule[] | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const stepMatch = useMatch('stap/:slug');

  const isSingleStep = type === 'single_step';

  if (
    !isSingleStep &&
    !stepMatch &&
    (stepValues !== null || requiresBackendLogic !== null || logicRules !== null)
  ) {
    setStepValues(null);
    setRequiresBackendLogic(null);
    setLogicRules(null);
    setIsInitialLoad(true);
  }

  const _setStepValues = useCallback(
    (values: JSONObject | null, isInitialLoad: boolean = false) => {
      setStepValues(values);
      setIsInitialLoad(isInitialLoad);
    },
    []
  );
  return (
    <DebugContext.Provider
      value={{
        stepValues: isInitialLoad && !stepValues ? null : stepValues,
        setStepValues: _setStepValues,
        requiresBackendLogic,
        setRequiresBackendLogic,
        logicRules,
        setLogicRules,
      }}
    >
      {children}
    </DebugContext.Provider>
  );
};

export const useDebugContext = () => useContext<DebugContextType>(DebugContext);

export interface DebugInfoProps {
  label: string;
  children: React.ReactNode;
}

const DebugInfo: React.FC<DebugInfoProps> = ({label, children}) => (
  <div className="debug-info">
    <div className="debug-info__label">{label}</div>
    <div className="debug-info__value">{children}</div>
  </div>
);

/**
 * Display debug information during development.
 *
 * @todo exclude this component from the bundle in production builds.
 */
const AppDebug: React.FC = () => {
  const {locale} = useIntl();
  const [{expiry}] = useGlobalState(sessionExpiresAt);
  const {stepValues, requiresBackendLogic, logicRules} = useDebugContext();
  return (
    <div className="debug-info-container" title="Debug information (only available in dev)">
      {stepValues && (
        <>
          <DebugInfo label="Submission data/values">
            <pre className="debug-info__code">
              <code>{JSON.stringify(stepValues, null, 2)}</code>
            </pre>
          </DebugInfo>
          <hr className="debug-info-container__spacer" />
        </>
      )}

      {requiresBackendLogic !== null && (
        <>
          <DebugInfo label="Frontend logic evaluation">{String(!requiresBackendLogic)}</DebugInfo>
          {logicRules !== null && (
            <DebugInfo label="Logic rules">
              <pre className="debug-info__code">
                <code>{JSON.stringify(logicRules, null, 2)}</code>
              </pre>
            </DebugInfo>
          )}
          <hr className="debug-info-container__spacer" />
        </>
      )}

      <DebugInfo label="Current locale">{locale}</DebugInfo>
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
