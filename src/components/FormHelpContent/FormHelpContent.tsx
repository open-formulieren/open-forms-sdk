import {HTMLContent} from '@utrecht/component-library-react';
import DOMPurify from 'dompurify';
import {useMemo} from 'react';

export interface FormHelpDialoContent {
  content: string;
}

/**
 * Sanitized rich text content for the form help functionality.
 */
const FormHelpContent: React.FC<FormHelpDialoContent> = ({content}) => {
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'ul', 'ol', 'li', 'p', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
  }, [content]);
  if (!content) throw new Error('You must pass non-empty content when rendering this components');
  return <HTMLContent dangerouslySetInnerHTML={{__html: sanitizedContent}} />;
};

export default FormHelpContent;
