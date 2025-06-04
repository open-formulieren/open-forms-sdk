import {Checkbox} from '@open-formulieren/formio-renderer';
import {CheckboxComponentSchema} from '@open-formulieren/types';
import {useMemo} from 'react';
import {defineMessages, useIntl} from 'react-intl';

import Body from '@/components/Body';
import ErrorMessage from '@/components/Errors/ErrorMessage';

import './StatementCheckbox.scss';

// FIXME: when the checkboxes are made generic, the warnings should be provided by the
// backend.
const WARNINGS = defineMessages({
  privacyPolicyAccepted: {
    description: 'Warning privacy policy not checked when submitting',
    defaultMessage: 'Please accept the privacy policy before submitting',
  },
  statementOfTruthAccepted: {
    description: 'Warning statement of truth not checked when submitting',
    defaultMessage: 'You must declare the form to be filled out truthfully before submitting',
  },
});

export interface StatementCheckboxProps {
  // the backend doesn't add the `id` property - that's okay, we can inject one if we
  // need to
  configuration: Omit<CheckboxComponentSchema, 'id' | 'defaultValue'> & {
    key: 'privacyPolicyAccepted' | 'statementOfTruthAccepted';
  };
  showWarning?: boolean;
}

const StatementCheckbox: React.FC<StatementCheckboxProps> = ({
  configuration: {key, label, validate = {}},
  showWarning = false,
}) => {
  const intl = useIntl();
  const rewrittenLabel = useMemo<string>(() => rewriteLabelHTML(label), [label]);

  if (!validate.required) return null;

  // TODO: When we rework this component, change the class names
  return (
    <div className="openforms-privacy-checkbox">
      <Checkbox
        name={key}
        label={
          <Body
            component="span"
            modifiers={['wysiwyg']}
            dangerouslySetInnerHTML={{__html: rewrittenLabel}}
          />
        }
        isRequired
      />
      {showWarning && (
        <ErrorMessage level="warning">{intl.formatMessage(WARNINGS[key])}</ErrorMessage>
      )}
    </div>
  );
};

/**
 * Paragraphs inside the label are both invalid markup and cause issues with the
 * required asterisk wrapping onto the next line, as this doesn't play nice with
 * flexbox.
 *
 * We get paragraph elements because WYSIWYG editors are used in the backend to
 * configure the content of these labels.
 *
 * This solution strips out the paragraphs and replaces them with linebreaks to create
 * a similar visual appearance, turning everything into an inline element.
 */
const rewriteLabelHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const paragraphs = doc.querySelectorAll('p');
  if (!paragraphs.length) return html;
  return [...paragraphs].map(p => p.innerHTML).join('<br><br>');
};

export default StatementCheckbox;
