import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAsync } from 'react-use';

import { get, put } from 'api';
import { ConfigContext } from 'Context';
import Loader from 'components/Loader';

import LanguageSelectionDisplay from './LanguageSelectionDisplay';


const DEFAULT_HEADING = (
  <FormattedMessage
    description="Language selection heading"
    defaultMessage="Choose language"
  />
);


const LanguageSelection = ({
  heading=DEFAULT_HEADING,
  headingLevel=2,
  onLanguageChanged=console.log,
}) => {
  // Hook uses
  const { baseUrl } = useContext(ConfigContext);
  const { locale } = useIntl();
  const [ err, setErr ] = useState(null);

  // fetch language information from API
  const {
    loading,
    value: languageInfo,
    error,
  } = useAsync(
    async () => {
      const result = await get(`${baseUrl}i18n/info`);
      // the browser preferences may have activated a different language than the
      // client-side default language. In that case, we need to inform the parent
      // components that the UI language needs to update.
      //
      // This will trigger the value of `locale` to change from the `useIntl()` hook.
      if (result.current !== locale) {
        onLanguageChanged(result.current);
      }
      return result;
    },
    [baseUrl, locale]
  );

  const anyError = err || error ;
  if (anyError) {
    throw anyError; // bubble up to boundary
  }
  if (loading) {
    return <Loader modifiers={["small"]} />;
  }

  const { current, languages } = languageInfo;
  // transform language information for display
  const items = languages.map( ({ code, name }) => ({
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
  const onLanguageChange = async (languageCode) => {
    // do nothing if this is already the active language
    if (languageCode === locale) return;

    // activate other language in backend
    try {
      await put(`${baseUrl}i18n/language`, { code: languageCode });
    } catch (err) {
      // set error in state, which gets re-thrown in render and bubbles up
      // to error bounary
      // FIXME: memory leak in storybook -> use decorator with error boundary
      setErr(err);
    }
    // update UI language
    onLanguageChanged(languageCode);
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
  onLanguageChanged: PropTypes.func,
};

export default LanguageSelection;
