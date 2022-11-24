import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import {FormattedMessage, defineMessage, useIntl} from 'react-intl';
import {useGlobalState} from 'state-pool';
import {useAsync} from 'react-use';

import {get, put} from 'api';
import {ConfigContext} from 'Context';
import {globalSubmissionState} from 'components/Form';
import Loader from 'components/Loader';
import {I18NContext, formatMessageForLocale} from 'i18n';

import LanguageSelectionDisplay from './LanguageSelectionDisplay';

const DEFAULT_HEADING = (
  <FormattedMessage description="Language selection heading" defaultMessage="Choose language" />
);

const changeLanguagePrompt = defineMessage({
  description: 'change language prompt',
  defaultMessage:
    'Changing the language will require you to restart the form. Are you sure you want to continue?',
});

const LanguageSelection = ({heading = DEFAULT_HEADING, headingLevel = 2}) => {
  // Hook uses
  const {baseUrl} = useContext(ConfigContext);
  const {onLanguageChangeDone} = useContext(I18NContext);
  const {locale} = useIntl();
  const [updatingLanguage, setUpdatingLanguage] = useState(false);
  const [err, setErr] = useState(null);
  const [submissionState] = useGlobalState(globalSubmissionState);

  // fetch language information from API
  const {
    loading,
    value: languageInfo,
    error,
  } = useAsync(async () => await get(`${baseUrl}i18n/info`), [baseUrl]);

  const anyError = err || error;
  if (anyError) {
    throw anyError; // bubble up to boundary
  }
  if (loading || updatingLanguage) {
    return <Loader modifiers={['small']} />;
  }

  const {languages} = languageInfo;
  // transform language information for display
  const items = languages.map(({code, name}) => ({
    lang: code,
    textContent: code.toUpperCase(),
    label: name,
    current: code === locale,
  }));

  /**
   * Event handler for user interaction to change the language.
   * @param  {String} languageCode The code of the (new) language to activate.
   * @return {Void}
   */
  const onLanguageChange = async languageCode => {
    // do nothing if this is already the active language
    // or if an update is being processed.
    if (updatingLanguage || languageCode === locale) return;

    const confirmationQuestion = formatMessageForLocale(languageCode, changeLanguagePrompt);

    // only prompt to confirm if there is an active submission
    if (submissionState.hasSubmission && !window.confirm(confirmationQuestion)) {
      return;
    }

    setUpdatingLanguage(true);
    // activate other language in backend
    try {
      await put(`${baseUrl}i18n/language`, {code: languageCode});
    } catch (err) {
      // set error in state, which gets re-thrown in render and bubbles up
      // to error bounary
      setUpdatingLanguage(false);
      setErr(err);
    }
    // update UI language
    setUpdatingLanguage(false);
    onLanguageChangeDone(languageCode);
  };

  return (
    <LanguageSelectionDisplay
      onLanguageChange={onLanguageChange}
      items={items}
      headingId="of-language-selection"
      heading={heading}
      headingLevel={headingLevel}
    />
  );
};

LanguageSelection.propTypes = {
  heading: PropTypes.node,
  headingLevel: PropTypes.number,
};

export default LanguageSelection;
