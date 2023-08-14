import {useFormikContext} from 'formik';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, {useContext, useEffect, useState} from 'react';
import {useAsync, usePrevious} from 'react-use';

import {ConfigContext} from 'Context';
import {get} from 'api';
import Button from 'components/Button';
import {Literal} from 'components/Literal';
import Loader from 'components/Loader';
import StatementCheckboxes from 'components/StatementCheckboxes';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {SUBMISSION_ALLOWED} from 'components/constants';

export const STATEMENTS_INFO_ENDPOINT = 'config/statements-info-list';

const getStatementsInfo = async baseUrl => {
  return await get(`${baseUrl}${STATEMENTS_INFO_ENDPOINT}`);
};

const isSubmitEnabled = (loading, statementsInfo = [], statementsValues) => {
  if (loading) return false;

  return statementsInfo.every(info => {
    if (!info.validate.required) return true;

    return Boolean(statementsValues[info.key]);
  });
};

const getStatementValues = (statementsInfo = [], formikValues) => {
  const statementValuesAsArray = statementsInfo
    .map(info => {
      if (!info.validate.required) return null;
      return [info.key, formikValues[info.key] || false];
    })
    .filter(item => Array.isArray(item));

  return Object.fromEntries(statementValuesAsArray);
};

const getInitialWarningValues = statementsValues => {
  const warningValuesAsArray = Object.entries(statementsValues).map(([statementKey]) => [
    statementKey,
    false,
  ]);
  return Object.fromEntries(warningValuesAsArray);
};

const SummaryConfirmation = ({submissionAllowed, onPrevPage}) => {
  const {baseUrl} = useContext(ConfigContext);
  const canSubmit = submissionAllowed === SUBMISSION_ALLOWED.yes;

  const {
    loading,
    value: statementsInfo = [],
    error,
  } = useAsync(async () => {
    if (!canSubmit) return [];

    return await getStatementsInfo(baseUrl);
  }, [baseUrl, getStatementsInfo, canSubmit]);
  const {values: formikValues} = useFormikContext();

  if (error) throw error;

  const submitDisabled = !isSubmitEnabled(loading, statementsInfo, formikValues);

  const [statementsWarnings, setStatementWarnings] = useState(
    getInitialWarningValues(getStatementValues(statementsInfo, formikValues))
  );

  const showWarnings = formikValues => {
    const statementValues = getStatementValues(statementsInfo, formikValues);

    let updatedWarnings = {...statementsWarnings};
    Object.entries(statementValues).forEach(([statementKey, statementValue]) => {
      if (!statementValue) {
        updatedWarnings = {...updatedWarnings, [statementKey]: true};
      }
    });
    setStatementWarnings(updatedWarnings);
  };

  const statementValues = getStatementValues(statementsInfo, formikValues);
  const previousStatementValues = usePrevious(statementValues);

  useEffect(() => {
    if (!previousStatementValues || isEqual(previousStatementValues, statementValues)) return;

    // If the Formik values have changed, update the warnings
    let updatedWarnings = {...statementsWarnings};
    Object.entries(statementValues).forEach(([statementKey, statementValue]) => {
      if (statementValue && statementsWarnings[statementKey]) {
        updatedWarnings = {...updatedWarnings, [statementKey]: false};
      }
    });
    setStatementWarnings(updatedWarnings);
  }, [statementValues, previousStatementValues, statementsWarnings]);

  return (
    <>
      {loading && <Loader />}
      <StatementCheckboxes
        loading={loading}
        canSubmit={canSubmit}
        statementsInfo={statementsInfo}
        statementsWarnings={statementsWarnings}
      />
      <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
        <ToolbarList>
          {!!onPrevPage && (
            <Button variant="anchor" component="a" onClick={onPrevPage}>
              <Literal name="previousText" />
            </Button>
          )}
        </ToolbarList>
        <ToolbarList>
          {canSubmit ? (
            <Button
              type="submit"
              variant="primary"
              name="confirm"
              disabled={loading || submitDisabled}
              onDisabledClick={() => !loading && showWarnings(formikValues)}
            >
              <Literal name="confirmText" />
            </Button>
          ) : null}
        </ToolbarList>
      </Toolbar>
    </>
  );
};

SummaryConfirmation.propTypes = {
  submissionAllowed: PropTypes.string.isRequired,
  onPrevPage: PropTypes.func,
};

export default SummaryConfirmation;
