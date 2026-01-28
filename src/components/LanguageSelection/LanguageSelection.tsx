import {LoadingIndicator} from '@open-formulieren/formio-renderer';
import type {SupportedLocales} from '@open-formulieren/types';
import {ButtonGroup} from '@utrecht/button-group-react';
import {Heading, LinkButton} from '@utrecht/component-library-react';
import {Fragment, useContext, useId, useState} from 'react';
import {FormattedMessage, type MessageDescriptor, defineMessage, useIntl} from 'react-intl';
import {useAsync} from 'react-use';
import {useState as useGlobalState} from 'state-pool';

import {ConfigContext} from '@/Context';
import {get, put} from '@/api';
import type {AnyError} from '@/components/Errors/types';
import {globalSubmissionState} from '@/data/submissions';
import {I18NContext, formatMessageForLocale} from '@/i18n';

const changeLanguagePrompt: MessageDescriptor = defineMessage({
  description: 'change language prompt',
  defaultMessage:
    'Changing the language will require you to restart the form. Are you sure you want to continue?',
});

export interface LanguageInfo {
  languages: {
    code: SupportedLocales;
    name: string;
  }[];
  current: SupportedLocales;
}

const LanguageSelection: React.FC = () => {
  // Hook uses
  const {baseUrl} = useContext(ConfigContext);
  const {onLanguageChangeDone} = useContext(I18NContext);
  const {locale} = useIntl();
  const [updatingLanguage, setUpdatingLanguage] = useState<boolean>(false);
  const [err, setErr] = useState<AnyError | null>(null);
  const [submissionState] = useGlobalState(globalSubmissionState);
  const headingId = useId();

  // fetch language information from API
  const {
    loading,
    value: languageInfo,
    error,
  } = useAsync(async () => (await get<LanguageInfo>(`${baseUrl}i18n/info`))!, [baseUrl]);

  const anyError = err || error;
  if (anyError) {
    throw anyError; // bubble up to boundary
  }
  if (loading || updatingLanguage) {
    return <LoadingIndicator size="small" />;
  }

  const {languages} = languageInfo!;
  // transform language information for display
  const items = languages.map(({code, name}) => ({
    lang: code,
    textContent: code.toUpperCase(),
    label: name,
    current: code === locale,
  }));

  /**
   * Event handler for user interaction to change the language.
   */
  const onLanguageChange = async (languageCode: SupportedLocales) => {
    // do nothing if this is already the active language
    // or if an update is being processed.
    if (updatingLanguage || languageCode === locale) return;
    const confirmationQuestion = await formatMessageForLocale(
      baseUrl,
      languageCode,
      changeLanguagePrompt
    );

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
      return;
    }
    // update UI language
    setUpdatingLanguage(false);
    onLanguageChangeDone(languageCode);
  };

  return (
    <section className="utrecht-alternate-lang-nav" aria-labelledby={headingId}>
      <Heading level={2} className="utrecht-alternate-lang-nav__heading" id={headingId}>
        <FormattedMessage
          description="Language selection heading"
          defaultMessage="Choose language"
        />
      </Heading>
      <ButtonGroup>
        {items.map(({current, label, lang, textContent}, i, a) => (
          <Fragment key={lang}>
            <LinkButton
              pressed={current}
              lang={lang}
              aria-label={label}
              onClick={() => onLanguageChange(lang)}
              inline
            >
              {textContent}
            </LinkButton>
            {i + 1 < a.length ? <Spacer /> : null}
          </Fragment>
        ))}
      </ButtonGroup>
    </section>
  );
};

const Spacer: React.FC = () => <span aria-hidden="true">{'|'}</span>;

export default LanguageSelection;
