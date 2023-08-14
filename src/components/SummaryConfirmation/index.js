import {useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import {useAsync} from 'react-use';

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

  const [showStatementWarnings, setShowStatementWarnings] = useState(false);

  return (
    <>
      {loading && <Loader />}
      {!loading && canSubmit && (
        <StatementCheckboxes statementsInfo={statementsInfo} showWarnings={showStatementWarnings} />
      )}
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
              onDisabledClick={() => !loading && setShowStatementWarnings(true)}
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
