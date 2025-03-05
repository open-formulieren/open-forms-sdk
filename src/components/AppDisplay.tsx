import classNames from 'classnames';

export interface AppDisplayProps {
  /**
   * Main content
   */
  children: React.ReactNode;
  /**
   * UI to change languages.
   */
  languageSwitcher?: React.ReactNode;
  /**
   * UI to display progression through the form steps.
   */
  progressIndicator?: React.ReactNode;
  /**
   * Element to display debug information.
   */
  appDebug?: React.ReactNode;
  /**
   * Main content.
   *
   * @deprecated Use children instead.
   *
   */
  router?: React.ReactNode;
}

/**
 * Main application display component - this is the layout wrapper around content.
 *
 * The Display component uses 'slots' for certain content blocks. The slot 'children'
 * is reserved for the main content.
 *
 */
export const AppDisplay: React.FC<AppDisplayProps> = ({
  children = null,
  languageSwitcher = null,
  progressIndicator = null,
  appDebug = null,
  router,
}) => (
  <div
    className={classNames('openforms-app', {
      'openforms-app--no-progress-indicator': !progressIndicator,
      'openforms-app--no-language-switcher': !languageSwitcher,
    })}
  >
    {languageSwitcher && <div className="openforms-app__language-switcher">{languageSwitcher}</div>}
    <div className="openforms-app__body">{children || router}</div>
    {progressIndicator && (
      <div className="openforms-app__progress-indicator">{progressIndicator}</div>
    )}
    {appDebug && <div className="openforms-app__debug">{appDebug}</div>}
  </div>
);

export default AppDisplay;
