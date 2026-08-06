import {HTMLContent} from '@utrecht/component-library-react';
import DOMPurify from 'dompurify';
import {useMemo} from 'react';

export interface RichTextProps {
  content: string;
}

/**
 * Sanitized rich text content, allowing HTML (as it's produced by our CSP post
 * processor in the backend).
 */
const RichText: React.FC<RichTextProps> = ({content}) => {
  const sanitizedContent = useMemo(
    () => DOMPurify.sanitize(content, {USE_PROFILES: {html: true}, FORCE_BODY: true}),
    [content]
  );
  if (!content) throw new Error('You must pass non-empty content when rendering this components');
  return <HTMLContent dangerouslySetInnerHTML={{__html: sanitizedContent}} />;
};

export default RichText;
