=============
SDK Changelog
=============

1.3.5 (2023-07-24)
==================

Periodic bugfix release

* [#3268] Fixed Piwik Pro Referrer URL.

1.3.4 (2023-06-21)
==================

Periodic bugfix release

* [#2875] Fixed SiteImprove analytics, for real this time.
* [#2929] Fixed a cache/storage invalidation bug which would sometimes lead to
  authentication errors.
* [#3096] Fixed validation errors inadvertedly being removed in repeating groups,
  blocking the form (step) submission.

1.3.3 (2023-04-19)
==================

* [#2875] Patched and confirmed fix for SiteImprove analytics tracking

1.3.2 (2023-04-14)
==================

Periodic maintenance release

* [#2909] Prevent the cursors jumping back to the start of email fields.
* [#2939] Fix co-sign component error 'missing next parameter'.

1.3.1 (2023-03-31)
==================

Periodic maintenance release

* [#2912] Fix disappearing drag and drop area when removing a file from the upload file widget.
* [#2911] Delegate validation of .heic and .heif files to the backend.
* [#2903] Prevent number and currency fields to re-fill themselves upon input deletion.
* [#2907] Improve the styling when titles are too long to fit on one line (avoid clipping them with ellipsis).
* [#2077] + [#2888] Enable reaching the "previous page" button with keyboard navigation.

1.3.0 (2023-03-01)
==================

Open Forms SDK 1.3.0 feature release.

This feature release contains roughly the following improvements compared to 1.2.0:

* Added support for multilingual forms
* Improved accessibility
* Improved mobile user experience
* Components are now organized in smart/presentational parts to make programmatic
  overriding/replacing easier
* More re-use of NL Design System components and principles + better design token
  documentation

See below for the detailed changes since the beta version.

.. warning:: SDK 1.3.0 requires at least version 2.1.0-rc.0 of the backend API.

Features
--------

* [#322] The focus-style ring color of login icons now adapts to the icon appearance
  (dark vs. light).
* [#2646] The privacy policy accept/reject is now recorded in the backend.
* [#2675] The progress indicator now stays in the viewport on non-mobile devices.
* [#337] Added support for translations to the group label of repeating groups

Bugfixes
--------

* [#348] Fixed unintended horizontal scroll on mobile.
* [#2676] Fixed/improved mobile behaviour.

    * Fixed regressions introduced between 1.2.x and 1.3.0 beta.
    * The progress indicator now closes after navigating.
    * Fixed overflowing text when large unbreakable words are present.
    * Fixed overflowing text in titles with large unbreakable words.
    * Reduced visual clutter due to repeated elements.
    * Added more spacing between title and body on start page.

* [#2686] Fixed regression in options menu of dropdowns.
* [#2708] Fixed rendering the missing value ``0`` in summary pages.
* [#2692] Fixed (visible) file input element being appended to the DOM by Formio.
* [security#19] Escape textarea content to prevent self-XSS.
* [security#22] Escape file upload user-generated content to prevent self-XSS.

Project hygiene
---------------

* Available/used design tokens (globally/per component) are now automatically documented
  in storybook from the style-dictionary build artifacts. Theme designers can use this
  information to find relevant tokens.
* Organized code of a number of components (Button, Anchor) into their own directories.
* Replaced deprecated Github Actions ``set-output`` command.
* [#311] Added repeating group component to Storybook documentation.
* [#365] Replaced storybook API mocks with MSW mocks.
* [#366] Added the ``FormStep`` component to the private API documentation in Storybook.
* Documented how to document stories in storybook.
* [#368] Refactored tests to use MSW mocks


1.3.0-beta.0 (2023-01-30)
=========================

First beta version of the SDK.

.. warning:: SDK 1.3.0 requires at least version 2.1.0-beta.0 of the backend API.

This beta version marks the feature freeze for the 1.3.0 SDK version (and the 2.1.0
backend version).

Features
--------

* [#2266] Added various ``aria-*`` attributes and more descriptive messages to improve
  accessibility
* [#2276] Added attributes to validation error messages and containers for improved
  accessibility
* [#2267] Improved accessibility of navigation elements
* [#2516] Use consistent 'bin' icons for delete buttons/icons instead of crosses
* [#2557] Added datetime component type

Bugfixes
--------

* Fixed incorrect ``inputType`` value for time component story
* [#2440] Fixed hidden components being displayed in repeating groups
* [#2502] Fixed appearance of disabled progress indicator links
* [#2377] Fixed link-hover theme configuration not being applied consistently. Note:
  you should now be using the ``--utrecht-link-*`` design tokens.
* [#2539] Fixed mime type validation for mime types unknown by the browser (such as
  ``.msg``)

Project maintenance
-------------------

* [#325] Fixed Content component story
* [#307] Added more components to Storybook documentation: Body, Fieldset, nested
  components
* Added more documentation in ``src/components/FormStep.js``
* Removed unused table component
* [#335] Configured turbosnap in Chromatic UI to save snapshots
* Updated the contributing guidelines and technical vision


1.3.0-alpha.1 (2022-12-19)
==========================

Second alpha for the 1.3.0 series

This release brings support for custom display-components via an experimental API. The
main ``OpenForm`` constructor now accepts a ``displayComponents`` object option, mapping
component labels to callbacks accepting the necessary props.

Which props must be supported, are documented in Storybook. Display components have
their own Story and documentation section. You can of course also find inspiration by
checking the code of our default components.

Features
--------

* [#1517] The ``Form`` component is now split into a smart and display component. This
  is the first pass at a component-replacement API for developers integrating the SDK.
* [#2374] The progress indicator is now split into a smart and display component, making
  it possible to replace this in your own application stack.
* [#2267] Form step names are now wrapped in headings in the summary page
* [#2272] Navigating between form steps/phases now sets accessible page titles
* [#2270] added focus styles to buttons and signature refresh button
* [#2447] Login buttons structure refactor, accounting for authentication plugins that
  work via 'machtigen' principles. This also splits the component into a smart and
  display component that can be replaced.

Bugfixes
--------

* [#2384] Fixed language switch before logging on/starting the form
* [#2391] Fix loading translated literals and progress steps
* [#2406] Make required checkboxes consistent in style if no asterisks are used
* [#2407, #2431] Scroll validation errors into view only on submit
* [#2465] Added user input marker to some Formio templates which should prevent
  accidental static translations to be loaded from user input
* [#2488] Force logic re-evaluation on repeating groups row delete

Project maintenance
-------------------

* Switched to using organization-wide project boards, allowing us to create and track
  issues directly in the SDK repository
* [#304] Added Formio ``signature`` component to Storybook
* [#305] Added Formio ``selectboxes`` component to Storybook
* [#306] Added Formio ``content`` component to Storybook
* Added import-sorting plugin to prettier
* Fix code previews in formio stories
* Fix flatpickr locale error in ``date`` component stories
* [#2465] Added example to Storybook for radio option labels with anchors/links embedded
* Update changelog title so it can be included in the backend docs build


1.3.0-alpha.0 (2022-11-21)
==========================

First alpha for the 1.3.0 series

Open Forms now aims to publish an alpha version every 4 weeks, and a new (minor) version
every quarter.

.. warning:: The default Open Forms theme is now only applied within the
   ``.openforms-theme`` selector. If you embed the SDK 1.3, you need to ensure a/the
   parent element has this class name.


Features
--------

* Added NL Design System class names to form.io components
* Added Utrecht component library devDependencies
* Use NL Design System React components under the hood
* Added ``TableHeader`` component
* Integrate utrecht-button component design tokens
* Integrate textbox/textarea design tokens
* [#2126] Reworked "delete" icons to be accessible via keyboard navigation
* [#2225] Only emit default styles/design tokens in openforms-theme scope
* [#2232] Added support form translations configuration (enabled/disabled)
* [#2253] Added ``LanguageSelection`` component presenting available languages
* [#2254] Conditionally render ``LanguageSelection`` (depending if translations are
  enabled for the form)
* [#2255] Added ``I18NManager`` to manage the currently active locale (when forms
  support translations)
* [#2256] Restart submission when the end-user changes the locale/language

Bugfixes
--------

* Fixed some accessibility issues
* [#1351] Allow negative numbers and currencies
* [#1180] Fixed analytics provider integrations
* [#2335] Re-display drag & drop on upload cancellation
* [#2344] Put asterisk next to repeating group label

Project maintenance
-------------------

* Set up Chromatic & Storybook for visual regression testing
* Updated Github Actions version following deprecation notices
* [#1345] Add story for required checkbox
* Updated browserslist database
* [#280] Added prettier and eslint integration

1.2.4 (2022-10-24)
==================

Preparation for 2.0.0 release

* [#1180] Fixed Google Analytics integration to track page views
* [#2234] Update API endpoints to use v2 URLs instead of v1

1.2.3 (2022-10-12)
==================

Fixed a number of styling issues

This patch introduces support for a number of new design tokens to customize styles as
well.

* Fixed flicker on summary page
* Tweaked styles of components using design tokens

  - [#2137] ``--of-file-upload-drop-area-padding`` for file upload padding
  - [#2138] ``--of-progress-indicator-mobile-margin`` for the progress indicator
    horizontal margins on mobile
  - [#2142] ``--of-fieldset-legend-color`` for the fieldset legend text color
  - [#2129] ``--of-summary-row-spacing`` for vertical spacing of summary rows
  - [#2150] ``--of-label-font-weight`` and ``--of-input-font-weight`` for label and
    input element font-weights.
  - [#2152] ``--of-typography-sans-serif-font-family`` to alter the main font-family

* [#2149] Fixed inconsistent padding for content components
* [#2129] Fixed responsiveness of summary page and tweaked step header styles

1.2.2 (2022-10-07)
==================

Fixed regression in danger button styling due to missing design tokens.

1.2.1 (2022-10-07)
==================

First 1.2.x series bugfixes

* [#2053] Fixed styling of a number of components to not overlay other page elements
* [#2056] Fixed broken file upload
* [#2058] Refactored summary page display to evaluate logic on backend instead of (badly)
  replicating this on the frontend
* [#2075] Fixed missing translations for (validation) errors in repeating groups
* [#2077] Make 'previous page' and privacy checkbox accessible with tab-navigate
* [#2073] Fixed accidental styling of content due to specific key names
* [#2067] Applied consistent error message style
* [#2084] Fixed "repeating group" row validation triggering complete form validation
* [#2082] Scroll first component with error into view if there are validation errors
* 📦️ restore build artifact correctly so dist/ ends up in npm
* [#2035] Scroll to top on step load
* [#551] Upgrade Formio.js to 4.13.12
* Fixed alignment Radio button circle/dot
* [#2101] Add label to repeating group
* Ensured that CSRF token is sent in file upload/delete calls
* Fixed Formio options for proper formio.js component rendering in Storybook
* [#2113] Added support for mobile styling of columns
* [#2124] Display max file size in file upload widget
* [#2127] Fixed UI state on hover for non-clickable nav "links"
* [#2114] replaced removed session delete endpoint

1.2.0 (2022-09-19)
==================

Feature release

.. note:: Note that this version REQUIRES at least version 2.0.0 of the Open Forms API.

Features
--------

* [#1687] We now run an explicit validation call during submission so that step
  submission validation errors from the backend can be displayed.
* [#1710] Added repeating groups component
* [#1717] Reworked handling of autofill fields (street/city) to not overwrite
  user-submitted data
* [#509] Users now get a warning when their session is about to expire with the option
  to extend it.
* The codebase now mostly uses design tokens for colors, improving the theming options
* [#1832] Debounce the location autofill API calls
* [#1933] Removed hardcoded authentication explanation message, instead you should
  define the relevant text/message in the form start explanation message.
* [#1944] Blocked step navigation without completed steps, except for staff-users
* [#1967] Deactivated and maintenance mode forms are now properly reported to end-users.
  Staff users can still continue in maintenance mode forms.

Bugfixes
--------

* [#1526] SDK now always calls the backend to evaluate form logic, even if the form is
  invalid on the client-side. Only valid data is passed to the backend.
* [#1868] Ensure that invalid data is still kept in the client-side data state (fix for
  new bug in #1526)
* [#1964] Adjusted padding on content components with CSS class
* Added missing button variant
* [#1738] Fixed sometimes *all* validation errors dissapearing when changing one field

Project maintenance
-------------------

* [#1603] Set up yarn workspaces and design tokens integration
* [#1516] Set up publishing the SDK as package to NPM
* Reworked internal API Error handling to be exception-based
* Wrap more errors in error boundaries and display appropriate UI components for the
  type of error
* [#1521] Added Storybook for component documentation and publish to Github pages
* Removed obsolete Formio wrapper component
* Added Formio components to Storybook docs
* Added theme switcher to Storybook docs
* Updated ``PropTypes`` for removed functionality in 2.0.0 backend
* Updated translations


1.1.1 (2022-07-25)
==================

Fixed a number of bugs

* [#1526] Fixed a situation where users could get "stuck" on a form step - backend logic
  checks are now always performed, using the input data that validates client-side.
* [#1687] Fixed the SDK progressing to the next step even if the backend has validation
  errors on step submission.
* Fixed displaying (generic) backend errors in a user-friendly way

1.0.4 (2022-07-25)
==================

Fixed a number of bugs

* [#1526] Fixed a situation where users could get "stuck" on a form step - backend logic
  checks are now always performed, using the input data that validates client-side.
* [#1687] Fixed the SDK progressing to the next step even if the backend has validation
  errors on step submission.
* Fixed displaying (generic) backend errors in a user-friendly way

1.1.0 (2022-05-24)
==================

Feature release 1.1.0 of the SDK

Nothing has changed since the release candidate, so please review those changes for
a complete overview.

1.1.0 Release Candidate (2022-05-16)
====================================

Feature release

.. note:: Note that this version REQUIRES at least version 1.1.0 of the Open Forms API.

Features
--------

* [#1404] Fields can now be required by default (without asterisk) and optional fields
  receive a suffix indicating they are. This behaviour is opt-in and configurable in the
  backend.
* [#1418] The logout button is now also displayed for authenticated users where form
  authentication is optional.
* [#1313] Forms can now automatically initiate authentication on load.
* [#1441] Logging out is now scoped to the form submission where the logout button is
  clicked, other forms in other browser tabs are no longer affected.
* [#1449] File uploads can now validate a maximum number of files.
* [#1479] "not-applicable" form steps (as determined by logic) are no longer shown on
  the summary page.
* [#1452] Phone number fields can now be validated more strictly (opt-in).
* [#1523] The login button icon no longer pretends to be a button and the link is now
  clickable.
* [#1541] The content component can now receive custom CSS classes, integrating better
  with NL Design System. Supported are: info, success, warning, error.
* [#1555] Display a loader while files are uploading.
* [#1451] Visibility of form elements can in the summary page can now be configured. The
  default behaviour (if unspecified) is to display visible fields. WYSIWYG content
  labels are no longer displayed, unless explicitly configured.
* [#1580] Show warning to accept privacy policy when users try to submit the form
  without accepting it.

Bugfixes
--------

This release also contains all the bugfixes up until the ``1.0.3`` version.

Project maintenance
-------------------

* Build CI for the ``stable/`` prefixed branches
* Ensure that for local dev we get CSRF tokens
* Node 16 is now the minimum required version
* Updated build toolchain to react-scripts 5.0.1 with webpack 5
* [#1514] Refactor color variables to use CSS variables for NL Design System integration
* Fixed our own usage of slash for math.div in the sass
* Upgrade to font-awesome 6
* Upgraded the sass version
* Removed unused font assets

1.0.3 (2022-05-16)
==================

Bugfix maintenance release

* [#1539] Fixed file upload not deleting temporary file in the backend when the file is
  removed again

1.0.2 (2022-04-25)
==================

Bugfix maintenance release

* [#1494] Fixed disabled/enabled state of form step submission button
* [#1527] Show only visible fields in summary

1.0.1 (2022-03-16)
==================

Bugfix maintenance release

* [1076] Fixed form submission not being blocked if there are still validation errors

1.0.0 (2022-03-10)
==================

Final fixes/improvements for the 1.0.0 release

* [#940] Fixed some smaller issues on confirmation screen
* [#1391] Implemented option to hide fieldset headers
* [#1393] Style and validate disabled fields
* Fixed some spelling mistakes in the Dutch translations
* [#1410] Send CSRF Token if provided

1.0.0-rc.3 (2022-02-25)
=======================

Bugfixes for issues still present in rc.2

* [#1368] Updated translations
* [#1371] Fixed Digid login by upgrading django-digid-eherkenning package
* [#1340] Fixed misaligned asterisk for required fields
* [#1301] Fixed validation in component variants with multiple=True:

  - BSN
  - Date
  - Phone number

* [#1374] Fixed broken appointment dependent-dropdowns

1.0.0-rc.2 (2022-02-16)
=======================

Fixed a set of bugs that didn't make it into rc.1

* [#1262] Fixed long filenames overflowing in file upload component
* [#807] Fixed strict Content Security Policy violations
* [#1270] Fixed formatting of numbers with decimalLimit=0
* [#1284] Fixed clearing address prefills
* [#1261] Fixed privacy-checkbox styling
* [#1274] Fixed more event/race conditions while typing values
* [#1193] Fixed styling of file upload validation errors
* [#942] Improved user experience when navigating between steps
* [#1018] Implemented various accessibility (a11y) improvements

1.0.0-rc.1 (2022-01-28)
=======================

* [#1226] Handle empty values in file fields.
* [#1224] Handle empty multi-file fields.
* [#1152] Handle additional time case validation
* [#1203] Fix empty file field representation


1.0.0-rc.0 (2022-01-17)
=======================

First release candidate of Open Forms SDK.

Features
--------

* Supports the Open Forms 1.0.x backend API
* Implements the form fill-out flow
  - Present authentication options
  - Render form definitions
  - Progress through form steps
  - Confirm form submission
  - Report backend processing status
* Supports a wide range of form widgets
  - Text based fields
  - Dropdowns, checkboxes, radio inputs
  - Date and time fields
  - Postcode, IBAN, BSN
  - Digital Signature
  - Co-signing
  - Map widget
  - Layout options: fieldsets, free content, columns
* Mobile/responsive support
* Appointment changing/cancellation
* Payment integration
* Session expiry management
* Analytics integration, out of the box support for Piwik/Matomo, SiteImprove and
  Google Analytics
* Internationalization support, Dutch and English supported out of the box

Developer features
------------------

* Analytics integration is pluggable, allowing you to register your own
* The custom templates & Formio modules are exposed, allowing you to customize the look
  and feel of components
* Load/embed through a single Javascript and CSS bundle
