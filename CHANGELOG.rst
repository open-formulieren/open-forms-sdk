=========
Changelog
=========

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
