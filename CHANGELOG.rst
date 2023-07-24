=========
Changelog
=========

1.2.10 (2023-07-24)
===================

Periodic bugfix release

* [#3268] Fixed Piwik Pro Referrer URL.

1.2.9 (2023-06-21)
==================

Periodic bugfix release

* [#2875] Fixed SiteImprove analytics, for real this time.
* [#2929] Fixed a cache/storage invalidation bug which would sometimes lead to
  authentication errors.
* [#3096] Fixed validation errors inadvertedly being removed in repeating groups,
  blocking the form (step) submission.

1.2.8 (2023-04-17)
==================

Periodic bugfix release

* [#2903] Fixed unintended clearing of number/currency data with backend logic
* [#2912] Fixed disappearing file upload drag and drop area after deleting a succesful
  upload.

1.2.7 (2023-03-01)
==================

Security release (low severity)

* [security#22] Fixed additional missing user-input escape when the filename of uploads
  is reflected in backend validation errors.

1.2.6 (2023-02-23)
==================

Security release (low severity)

When HTML is used in the filename of an upload, self-XSS is possible. The impact is
limited when using a content-security policy blocking inline scripts.

* [#1351] Allow negative numbers and currencies
* [security#22] Escape file upload user-generated content to prevent self-XSS.

1.2.5 (2023-01-19)
==================

Security release (low severity)

This seemed to only be triggered in form configurations with textareas and data pickers,
while the end-user needs to input malicious content by themselves. Additionally, using
a content-security policy blocking inline scripts severely hinders the exploitability.

* [security#19] Escape textarea content to prevent self-XSS.

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
