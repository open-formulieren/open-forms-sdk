import {FormattedMessage} from 'react-intl';

import {getBEMClassName} from 'utils';

export const MODIFIERS = ['centered', 'only-child', 'small', 'gray'] as const;

export interface LoaderProps {
  modifiers?: (typeof MODIFIERS)[number][];
  withoutTranslation?: boolean;
}

const Loader: React.FC<LoaderProps> = ({modifiers = [], withoutTranslation}) => {
  const className = getBEMClassName('loading', modifiers);
  return (
    <div className={className} role="status">
      <span className={getBEMClassName('loading__spinner')} />
      <span className="sr-only">
        {withoutTranslation ? (
          'Loading...'
        ) : (
          <FormattedMessage description="Loading content text" defaultMessage="Loading..." />
        )}
      </span>
    </div>
  );
};

export default Loader;
