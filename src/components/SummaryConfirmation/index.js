import {useFormikContext} from 'formik';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, {useContext, useEffect, useState} from 'react';
import {useAsync, usePrevious} from 'react-use';

import {ConfigContext} from 'Context';
import {get} from 'api';
import Button from 'components/Button';
import DeclarationCheckboxes from 'components/DeclarationCheckboxes';
import {Literal} from 'components/Literal';
import Loader from 'components/Loader';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import {SUBMISSION_ALLOWED} from 'components/constants';

export const STATEMENTS_INFO_ENDPOINT = 'config/statements-info-list';

const getDeclarationsInfo = async baseUrl => {
  return await get(`${baseUrl}${STATEMENTS_INFO_ENDPOINT}`);
};

const isSubmitEnabled = (loading, declarationsInfo = [], declarationsValues) => {
  if (loading) return false;

  return declarationsInfo.every(info => {
    if (!info.validate.required) return true;

    return Boolean(declarationsValues[info.key]);
  });
};

const getDeclarationValues = (declarationsInfo = [], formikValues) => {
  const declarationValuesAsArray = declarationsInfo
    .map(info => {
      if (!info.validate.required) return null;
      return [info.key, formikValues[info.key] || false];
    })
    .filter(item => Array.isArray(item));

  return Object.fromEntries(declarationValuesAsArray);
};

const getInitialWarningValues = declarationsValues => {
  const warningValuesAsArray = Object.entries(declarationsValues).map(([declarationKey]) => [
    declarationKey,
    false,
  ]);
  return Object.fromEntries(warningValuesAsArray);
};

const SummaryConfirmation = ({submissionAllowed, onPrevPage}) => {
  const {baseUrl} = useContext(ConfigContext);
  const canSubmit = submissionAllowed === SUBMISSION_ALLOWED.yes;

  const {
    loading,
    value: declarationsInfo = [],
    error,
  } = useAsync(async () => {
    if (!canSubmit) return [];

    return await getDeclarationsInfo(baseUrl);
  }, [baseUrl, getDeclarationsInfo, canSubmit]);
  const {values: formikValues} = useFormikContext();

  if (error) throw error;

  const submitDisabled = !isSubmitEnabled(loading, declarationsInfo, formikValues);

  const [declarationsWarnings, setDeclarationWarnings] = useState(
    getInitialWarningValues(getDeclarationValues(declarationsInfo, formikValues))
  );

  const showWarnings = formikValues => {
    const declarationValues = getDeclarationValues(declarationsInfo, formikValues);

    let updatedWarnings = {...declarationsWarnings};
    Object.entries(declarationValues).forEach(([declarationKey, declarationValue]) => {
      if (!declarationValue) {
        updatedWarnings = {...updatedWarnings, [declarationKey]: true};
      }
    });
    setDeclarationWarnings(updatedWarnings);
  };

  const declarationValues = getDeclarationValues(declarationsInfo, formikValues);
  const previousDeclarationValues = usePrevious(declarationValues);

  useEffect(() => {
    if (!previousDeclarationValues || isEqual(previousDeclarationValues, declarationValues)) return;

    // If the Formik values have changed, update the warnings
    let updatedWarnings = {...declarationsWarnings};
    Object.entries(declarationValues).forEach(([declarationKey, declarationValue]) => {
      if (declarationValue && declarationsWarnings[declarationKey]) {
        updatedWarnings = {...updatedWarnings, [declarationKey]: false};
      }
    });
    setDeclarationWarnings(updatedWarnings);
  }, [declarationValues, previousDeclarationValues, declarationsWarnings]);

  return (
    <>
      {loading && <Loader />}
      <DeclarationCheckboxes
        loading={loading}
        canSubmit={canSubmit}
        declarationsInfo={declarationsInfo}
        declarationsWarnings={declarationsWarnings}
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
