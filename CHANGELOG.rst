=========
Changelog
=========

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
