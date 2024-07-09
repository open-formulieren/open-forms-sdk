=============
SDK Changelog
=============

2.3.1 (2024-07-09)
==================

Feature release - this changelog also includes the changes from the alpha release.

.. warning:: SDK 2.3.0 requires the backend API version 2.7.0 or newer.

.. note:: Version 2.3.0 does not exist - a beta build was accidentally released to npm
   as 2.3.0.

New features
------------

* [#4115, #4208] Support different kinds of GovMetric feedback (aborting the form vs.
  completing the form).
* [#3993] The ``addressNL`` component can now derive street name/city from postcode and
  house number.
* [#4423] The ``addressNL`` component now supports single column layout mode too, in
  addition to the existing double column layout.

Bugfixes
--------

* [#4382] Fixed the "pause modal" not being submittable after validation errors and
  added better validation.
* [#4328] Fixed the Govmetric smiley images not rendering.
* [#4199] Fixed starting submissions anonymously while already logged in. Before, the
  existing authentication metadata was added as if you started the form with login.
* [#4158] Fixed custom error messages not being picked up for datetime, date and time
  components.
* [#4009] Fixed fieldset components accidentally displaying a value in the summary.
* [#4082] Fixed multiple submissions being created when starting a form.
* [#4172] Fixed a crash when validating a date against a minimum/maximum date.
* [#4130] Forms requiring payment no longer offer the user to go back to the main page.
* [#4201] Fixed a crash when a map component is hidden.
* [#4222] Fixed being able to circumvent the maximum number of files limit.
* [#4220] Fixed "optional" translation for radio and selectboxes components.
* [#4207] Fixed styling overflow for select dropdown.

Project maintenance
-------------------

* Dropped support for SDk 2.0 and older.

Deprecations
------------

* Location autofill in textfield components is deprecated and will be removed in SDK
  3.0. Instead, use the ``addressNL`` component.

2.2.3 (2024-06-14)
==================

Bugfix release

* [#4328] Fixed the Govmetric smiley images not rendering.

2.2.2 (2024-05-08)
==================

Bugfix release

* [#4115] Support different kinds of GovMetric feedback (aborting the form vs. completing the form).

2.3.0-alpha.0 (2024-05-01)
==========================

First preview release of the upcoming 2.3.0 version.

* [#4009] Fixed fieldset components accidentally displaying a value in the summary.
* [#4082] Fixed multiple submissions being created when starting a form.
* [#4172] Fixed a crash when validating a date against a minimum/maximum date.
* [#4130] Forms requiring payment no longer offer the user to go back to the main page.
* [#4115, #4208] Support different kinds of GovMetric feedback (aborting the form vs. completing the form).
* [#4201] Fixed a crash when a map component is hidden.
* [#4222] Fixed being able to circumvent the maximum number of files limit.
* [#4220] Fixed "optional" translation for radio and selectboxes components.
* [#4207] Fixed styling overflow for select dropdown.

2.2.1 (2024-04-16)
==================

Bugfix release

* [#4082] Fixed duplicate creation of submissions when starting a form after authenticating.
* [#4172] Fixed the minimum date for a date field incorrectly saying the input is invalid.

2.2.0 (2024-03-22)
==================

Feature release - all the changes from 2.2.0-alpha.0 are also included!

New features
------------

* [#3855] Added better error handling on submission start, e.g. crashes because of a DMN
  backend being down.
* [#3791] The abort button is now consistently applied through all variants of
  authenticated/non-authenticated form submissions, turning into a "logout" button
  when relevant.
* [#3957] Updated to the new eIDAS logo.
* [#483] Added support for descriptions in addition to the label for radio and
  selectboxes options.

Bugfixes
--------

* [#654] Fixed a styling regression in radio/selectboxes.

Project maintenance
-------------------

* [#650] Replaced the Yarn package manager with ``npm``.
* Upgraded a number of dependencies to their latest available versions.
* [#662] Upgraded to Storybook 8.
* [#645] The session expiry notice is now its own route, making cleanup easier.
* Bumped github actions to their latest versions.
* Replaced Formiojs with a fork to address Formio CDN referencess to vulnerable versions
  of WYSIWYG libraries. Note that this was not deemed a security concern by us, since
  Internet Explorer is required which is end of life.

2.1.4 (2024-03-14)
==================

Bugfix release

* [#3845] Fixed WYSIWYG content missing styling in summary page.

2.0.4 (2024-03-14)
==================

Bugfix release

* [#3845] Fixed WYSIWYG content missing styling in summary page.

1.5.8 (2024-03-14)
==================

Bugfix release

* [#3845] Fixed WYSIWYG content missing styling in summary page.

2.2.0-alpha.0 (2024-02-19)
==========================

First preview release of the upcoming 2.2.0 version.

Features
--------

* [#3680] Co-sign login now supports all authentication plugins available on the form.
* The "required field asterisk" can now be used in themes other than the Open Forms theme.
* [#2617] Added UI support for dynamic no-payment-required situations.

Bugfixes
--------

* Added the base class ``utrecht-form-label--openforms`` on component labels where it
  was missing so that styling can be properly isolated.
* [#642] Updated DigiD error message text.
* [#3835] Fixed the progress indicator displaying non-applicable steps despite the
  being configured to hide them instead of appending a suffix.

Project maintenance
-------------------

* Fixed some test warnings.

2.1.3 (2024-02-06)
==================

Bugfix release

* Included missing GovMetric translations.
* [#642] Updated DigiD error message text.

2.0.3 (2024-02-06)
==================

Bugfix release

* [#642] Updated DigiD error message text.
* [#3805] Fixed the form field label if a field is not required and asterisks for
  required fields are disabled.

1.5.7 (2024-02-06)
==================

Bugfix release

* [#642] Updated DigiD error message text.

1.4.8 (2024-02-06)
==================

Bugfix release

* [#642] Updated DigiD error message text.


2.1.2 (2024-01-25)
==================

This release fixes some defects in SDK 2.1.x

* [#180] Added missing UI code for GovMetric analytics.
* [#3805] Fixed the form field label if a field is not required and asterisks for
  required fields are disabled.

2.1.1 (2024-01-25)
==================

Fixed a release blocker

* [#3616] Fixed not recording query string parameters in hash-based routing embed mode

2.1.0 (2024-01-25)
==================

Feature release - all the changes from 2.1.0-alpha.0 are also included!

New features
------------

* [#3607] Added a new component type ``addressNL``, taking postcode and house number,
  which supports validation against the BRK. This component may replace the address
  auto-complete (based on ``textfield``) in the future.

* Updated some literals to be more accessible

    * [#3690] Update texts for authentication plugin outages to be B1-level.
    * [#619] Update texts in the map component to be B1-level.

* ⚠️ We have adapted more NL Design System components for our SDK, please review the
  `2.1.0 upgrade notes`_. If you're developing your own theme, this
  may break some styling. Users of the default Open Forms theme (even if you tweak some
  design tokens in the backend) are not affected.

    * [#471] Refactored the ``FormStepSummary`` to make use of ``DataList`` and
      ``Heading2`` components.
    * [3178] Reworked the layout scaffolding to support NL DS principles - appearance
      can now be configured through design tokens.
    * We now expect an outer wrapper with the class name ``utrecht-document``, any CMS
      making use of embedding should ensure this class is applied in a form container (
      ideally you apply this to the ``html`` or ``body`` element).

* [#3726] Reworked the payment and confirmation page flows - it is now more obvious that
  the user still needs to be pay (if payment is relevant).
* [#3778] Content components displayed on the summary do not display a name/label, to be
  consistent with email and PDF summary.

Bugfixes
--------

* [#3671] Fixed max date validation when "today" is included.

Project maintenance
-------------------

* Upgraded the development tooling to Node 20 (LTS).
* Upgraded playwright to be compatible with Debian 12.
* Upgraded dependencies to reduce the amount of warnings during ``yarn install``.
* [#584] Added mobile snapshots to Storybook and Chromatic configuration to run visual
  regression tests on multiple viewports.
* Marked the ``stable/1.3.x`` release branch as end-of-life.
* [#614] The Leaflet Dutch coordinate system code is replaced with a reusable library.

.. _2.1.0 upgrade notes: https://open-formulieren.github.io/open-forms-sdk/?path=/docs/developers-upgrade-notes-2-1-0--docs

2.0.2 (2024-01-12)
==================

Bugfix release

* [#3671] Fixed max date validation when "today" is included.

2.1.0-alpha.0 (2023-12-15)
==========================

First preview release of the upcoming 2.1.0 version.

Features
--------

* [#469] Repeating groups now use NL DS data-list components and appearance is
  configurable through design tokens.
* [3178] Reworked the layout scaffolding to support NL DS principles - appearance can
  now be configured through design tokens.
* [#36] Reworked the implementation of the progress indicator, you can now use existing
  NL DS component design tokens and further tweak the appearance through custom design
  tokens. The scrolling behaviour and text overflow/cutoff (on mobile) is now also fixed,
  and the component is not invasive anymore when embedding the SDK in a third party CMS.
* [#3651] Changed the optional field label suffix to more accessible language.

Bugfixes
--------

* [#3576] Repeating groups summary no longer displays colons when no component label is
  available.
* Fixed regression in leaflet styles not being included in CSS bundle.
* [#3362] Fixed support for backend-to-frontend server side redirects when using
  hash-based routing.
* [#3612] Fixed the maximum date validation not being run when both ``min`` and ``max``
  are specified.
* [#3611] Fixed time component validation to allow the exact min/max value (bounds are
  now inclusive).
* [#3450] Fixed text overflow not being properly hyphenated.
* [#607] Fixed the regular expression for phone number validation to disallow leading
  dashes or spaces.
* [#3647] Applied a bandaid fix to Formio/momentjs turning in invalid time value into
  the literal string 'Invalid date'. Instead, the invalid value is now kept (and the
  validation error is still displayed).

Project maintenance
-------------------

* Cleaned up the columns CSS.
* Refactored routes for ``ManageAppointment``.
* Fixed ``localStorage`` cleanup in storybook.

1.5.6 (2023-12-12)
==================

Periodic bugfix release

* [#3647] Applied a bandaid fix to Formio/momentjs turning in invalid time value into
  the literal string 'Invalid date'. Instead, the invalid value is now kept (and the
  validation error is still displayed).
* Applied (a partial) fix for hash-based routing when embedding a form. Forms load
  properly now and can be submitted, however the resume-from-backend flow still has
  known issues for which you'll need SDK 2.1.

1.4.7 (2023-12-12)
==================

Periodic bugfix release

* [#3647] Applied a bandaid fix to Formio/momentjs turning in invalid time value into
  the literal string 'Invalid date'. Instead, the invalid value is now kept (and the
  validation error is still displayed).

1.3.9 (2023-12-12)
==================

Periodic bugfix release

* [#3647] Applied a bandaid fix to Formio/momentjs turning in invalid time value into
  the literal string 'Invalid date'. Instead, the invalid value is now kept (and the
  validation error is still displayed).

2.0.1 (2023-12-08)
==================

Open Forms SDK 2.0.1 fixes some defects.

* [#3612] Fixed the maximum date validation not being run when both ``min`` and ``max``
  are specified.
* [#3611] Fixed time component validation to allow the exact min/max value (bounds are
  now inclusive).
* [#607] Fixed the regular expression for phone number validation to disallow leading
  dashes or spaces.
* [#3647] Applied a bandaid fix to Formio/momentjs turning in invalid time value into
  the literal string 'Invalid date'. Instead, the invalid value is now kept (and the
  validation error is still displayed).

1.5.5 (2023-11-09)
==================

Hotfix release

* [#3536] Fixed a crash in appointments when clearing or specifying an invalid number of
  persons for a product/service
* [#3572] Fixed a race condition on WebKit that would cause the submit button to get
  stuck in the disabled state.
* [#3577] Fixed an issue with checkbox/radio buttons on WebKit that would make only the
  label clickable and not the checkbox/radio itself.
* [#587] Fixed a checkbox label focus outline regression.

1.4.6 (2023-11-09)
==================

Hotfix release

* [#3572] Fixed a race condition on WebKit that would cause the submit button to get
  stuck in the disabled state.

1.3.8 (2023-11-09)
==================

Hotfix release

* [#3572] Fixed a race condition on WebKit that would cause the submit button to get
  stuck in the disabled state.

2.0.0 (2023-11-08)
==================

💥 Breaking changes ahead!

We've opted to bump the major version number of the SDK due to a number of refactors
with (potential) breaking changes to existing environments. This release was originally
scheduled to become v1.6.0, so all the 1.6.0-alpha.0 changes are included in this
version too.

.. warning:: SDK 2.0.0 requires at least version 2.4.0 of the Open Formulieren API.

Breaking changes
----------------

**Button component refactor**

We've refactored all of our button component usage with the ``utrecht-button`` component
from the NL Design System community. The design tokens that were used before to change
the appearance of buttons no longer work, instead you must specify the equivalent
utrecht-button design tokens. We've provided a mapping:

* ``--utrecht-button-primary-action-focus-border-color`` has ``#000000`` (black) in the
  Open Forms theme.
* ``--utrecht-button-primary-action-danger-focus-border-color`` has ``#000000`` (black)
  in the Open Forms theme.
* ``--utrecht-button-secondary-action-danger-background-color`` takes the value of the
  old ``--of-button-danger-bg``.
* ``--utrecht-button-secondary-action-danger-color`` takes the value of the old
  ``--of-button-danger-fg``.
* ``--utrecht-button-secondary-action-focus-border-color`` takes the value of the old
  ``--of-color-focus-border``.
* ``--utrecht-button-subtle-danger-color``  takes the value of ``--of-color-danger``.
* ``--utrecht-button-subtle-danger-background-color``  takes the value of
  ``--of-color-bg``.
* ``--utrecht-button-subtle-danger-hover-background-color`` takes the value
  ``--of-color-bg``.
* ``--utrecht-button-subtle-danger-active-background-color`` takes the value of the old
  ``--of-button-danger-active-bg``.
* ``--utrecht-button-disabled-color``. This does not take the value of an old token. For
  the Open Forms theme this is now ``#ffffff``.
* ``--utrecht-button-disabled-background-color``. This does not take the value of an old
  token, the colour was previously obtained by graying out the primary button. For the
  Open Forms theme, this is now ``#b0b0b0``.
* ``--utrecht-action-disabled-cursor``. This does not take the value of an old token. It
  controls the looks of the cursor when hovering a disabled button. For the Open Forms
  theme, this is now ``not-allowed``.
* ``--utrecht-action-submit-cursor``. This does not take the value of an old token. It
  controls the looks of the cursor when hovering over a submit button. For the Open
  Forms theme, this is now ``pointer``.

Additionally, in the ``.openforms-theme`` we apply some custom CSS overrides that may
need to be replicated in your own theme since they're now scoped to our own theme
selector.

Unfortunately, setting up a backwards compatible layer was considered too complex.

**Buttons that look like links**

These are now actual links instead of button elements. If you have automated test
scripts, they may fail on these links now when querying by accessible role.

**Formio time component cleanup [#3531]**

The time component min/max time validation is moved into the ``validate`` namespace, for
a consistent builder configuration.

Existing component definitions need to be updated: ``component.minTime`` becomes
``component.validate.minTime``, and a similar action is needed for ``maxTime``. This is
done automatically in the Open Forms backend, so it only requires attention if you have
other form definition sources.

**Alert component refactor**

The alert component has also been refactored to use the Utrecht alert component. In order to
maintain the same styles as in the previous version, the following Utrecht design tokens
should be set:

* ``--utrecht-alert-warning-background-color`` with the value of ``--of-alert-warning-bg``.
* ``--utrecht-alert-info-background-color`` with the value of ``--of-alert-info-bg``.
* ``--utrecht-alert-error-background-color`` with the value of ``--of-alert-error-bg``.
* ``--utrecht-alert-icon-error-color`` with the value of ``--of-color-danger``.
* ``--utrecht-alert-icon-info-color`` with the value of ``--of-color-info``.
* ``--utrecht-alert-icon-warning-color`` with the value of ``--of-color-warning``.
* ``--utrecht-alert-icon-ok-color`` with the value of ``--of-color-success``.

We've set up a backwards compatibility layer for these design tokens, so they won't
break just yet, but we urge you to update your themes.

New features
------------

* [#437] Added support for Home/End keypresses in the select component search box to
  move the cursor to the start/end of the input.

* We're using more NL Design System components instead of rolling our own

    * [#571] Removed the openforms-form-control wrapper around form fields. The
      ``utrecht-form-field`` and ``utrecht-form-fieldset`` components already fulfill
      this role.
    * [#462] Replaced our own button component/variants with the ``utrecht-button``
      component.
    * [#454] The editgrid (repeating group) markup and styling now make better use of
      NL DS & NL DS principles.
    * [#464] Navigation links that used to be buttons-styled-like-a-link are now actual
      links for correct, accessible semantics.
    * [#467] Replaced our own alert component with the ``utrecht-alert`` component.

* [#2952] Added support for steps that are initially not-applicable.
* [#524] Improved accessible labels on number fields with suffixes.

Bugfixes
--------

* [#3510] Fixed the closest address under the map component being overlaid on the next
  field.
* [#546] Fixed excessive amounts of API calls firing in new appointments.
* [#2656] Fixed the address autofill when the fields are nested in repeating groups.
* [#3485] Fixed hidden components messing with the vertical spacing between components.
* [#3536] Fixed appointment form crashes when number field input was not a valid number.
* [#3572] Fixed a race condition on WebKit browsers.

Project maintenance
-------------------

* Fixed tests breaking due to DST change.
* Bumped design-token-editor to latest version.

1.5.4 (2023-10-30)
==================

Periodic bugfix release

* Fixed the width of the progress indicator on mobile devices.
* [#3510] Fixed the closest address under the map component being overlaid on next field.
* [#2656] Fixed the address autofill when the fields are nested in repeating groups.
* [#546] Fixed excessive amounts of API calls firing in new appointments.

1.4.5 (2023-10-30)
==================

Periodic bugfix release

* Fixed the width of the progress indicator on mobile devices.
* [#2656] Fixed the address autofill when the fields are nested in repeating groups.
* [#3523] Fixed not sending privacy policy information to the backend when the field is
  not rendered.

1.3.7 (2023-10-30)
==================

Periodic bugfix release

* Fixed the width of the progress indicator on mobile devices.
* [#2656] Fixed the address autofill when the fields are nested in repeating groups.

1.6.0-alpha.0 (2023-10-02)
==========================

First preview release of the upcoming 1.6.0 version.

Features
--------

* [#3300] Appointments: added product pre-selection via query string parameters.
* [#1884] Added more flexibility for custom time component validation errors.
* [#3443] Added (custom) validation errors for date components and allow manual entering
  of invalid dates so that validation errors are displayed instead of input being
  discarded.
* [#3414] Co-sign authentication buttons now have more distinctive styling (+ support
  theming via design tokens).
* [#3383] When using multiple backend validation plugins on a plugin, they now accept
  the user input as soon as *any* plugin accepts it rather than *all* plugins.

Bugfixes
--------

* Fixed width of progress indicator on mobile.
* [#3419] Fixed tooltips not applying design tokens everywhere.
* [#3385] Fixed inconsistent styles because of browser validation errors being shown
  rather than own validation messages.

Project maintenance
-------------------

* Added ``stable/1.5.x`` branch to CI configuration.
* The SDK build artifact should now include the version number.
* [#309] Added story for cosign component.
* Fixed products schema proptype warning.
* Reorganized appointments code.

1.5.3 (2023-09-29)
==================

Hotfix for WebKit based browsers

* [#3511] Fixed user input "flickering" in forms with certain (backend) logic on Safari
  & other WebKit based browsers.

1.4.4 (2023-09-29)
==================

Hotfix for WebKit based browsers

* [#3511] Fixed user input "flickering" in forms with certain (backend) logic on Safari
  & other WebKit based browsers.

1.5.2 (2023-09-25)
==================

Periodic bugfix release

* [#3418] Fixed asterisk being shown on not-required selectboxes/radio fields.
* [#3404] Fixed inaccurate amount of products being sent to the backend in appointment
  forms.
* [#3385] Disabled browser validation on form.

1.4.3 (2023-09-25)
==================

Periodic bugfix release

* [#3385] Disabled browser validation on form.

1.3.6 (2023-09-25)
==================

Periodic bugfix release

* [#3385] Disabled browser validation on form.

1.2.11 (2023-09-25)
===================

Final bugfix release in the 1.2.x series.

* [#3385] Disabled browser validation on form.

1.5.1 (2023-08-24)
==================

Hotfix release

The truth checkbox statement error message key was not aligned with the value received
from the backend.

1.5.0 (2023-08-23)
==================

New SDK minor version.

We've worked on a couple of big topics in this release:

* a tailored flow for appointment forms. Legacy appointments features are now
  deprecated and will be removed in SDK 2.0.
* improved handling of maps/geographical information.
* various improvements for NL Design System integration, which is still an ongoing effort.

.. warning:: SDK 1.5.0 requires at least version 2.3.0 of the Open Formulieren API.

This release includes the changes from 1.5.0-alpha.0.

Features
--------

* [#2174] Added a map search widget to find locations based on address auto-complete search.
* [#3045] Added support for affixes in Form.io (number) fields.
* [#2176] Added gesture handling for the map component.
* [#3203] Added more generic support for "submission confirmation" checkboxes for the
  user to agree to.
* [#3332] Ensure that the list of available appointment products is retrieved with the
  context of the already selected products.
* [#1884] Added support for custom validation errors in the Form.io time component.
* [#493] Added support for error message translations in new form validation library.
* [#492] Added field-reset behaviour to dependent fields in appointment form.
* [#3299] The amount field is now read-only when the appointment form does not support
  multiple products.
* [#506] Ensured that any backend processing errors during appointment creation are
  displayed to the end user.
* [#508] Added state checks to prevent users directly accessing nested URLs in
  appointment forms.

Bugfixes
--------

* [#515] Fixed date presentation of dates in January having an empty month.
* [#517] Updated react-leaflet to be compatible with React 18.
* [#3312] Fixed broken select component styling due to CSP errors.
* [#514] Appointment form pages now always allow submit, deferring client-side
  validation until the submit button is clicked.
* [#3322] Fixed broken appointment cancel routes.
* [#3327] Fixed order of style imports breaking the radio and checkbox styling in
  production builds.
* [#505] Added session storage cleanup to session expiry reset handler.

Project maintenance
-------------------

* [#3322] Reworked calculation of "form URL" to record the public (root) URL of a form
  during submission creation in the backend.
* Added storybook test runner to CI configuration and coverage reporting from Storybook.
* Updated dependencies via @dependabot.
* Documented how to deal with non-generic validation error translations using Zod.
* Prevent errors on test teardown due to missing ``act`` calls.
* [#463] Added SDK version number to Javascript bundle.

1.5.0-alpha.0 (2023-07-24)
==========================

First preview release of the upcoming 1.5.0 version.

.. warning:: SDK 1.5.0-alpha.0 requires at least version 2.3.0-alpha.0 of the Open
   Formulieren API.

Features
--------

* Implemented a bunch of (non-formio) form components:

    * [#433] Added an input group component to split a single field in multiple user input
      elements for better user experience.
    * [#433] Added the input group widget for date fields (day, month, year) with
      localization.
    * [#465] Added the radio field component.

* NL Design system improvements

    * [#468] Reworked selectboxes to have NL DS markup and styling.
    * [#475] Reworked radio inputs to have NL DS markup and styling.
    * [#476] Reworked checkboxes to have NL DS markup and styling.

* [#1892] Added tooltips to formio components.
* [#3209] Added base tooltip styling, configurable via design tokens.

* [#2471] Appointments rework - there is now a dedicated appointment flow without Form.io

    .. note:: This is currently in preview to get some early feedback, but we are aware
       of a number of issues.

    * [#3066] Added contact details step, showing the required fields as exposed by the
      backend.
    * Appointment data submitted in any step is persisted in the session storage so that
      it survives hard-refreshes. This also makes it possible to open multiple forms in
      multiple browser tabs/windows.
    * [#3067] Exposed the appointment flow in the main app routes.
    * UI toggles between single/multi-product depending on backend support.
    * [#435] Added client-side user input validation.

* [#2175] Support initial map center and zoom level from backend configuration.

Bugfixes
--------

* [#3268] Fixed Piwik Pro Referrer URL.

Project maintenance
-------------------

* Bumped ``requests`` in CI tooling following security reports via @dependabot.
* Upgraded to Storybook 7.
* Added Amsterdam and Rotterdam (WIP) design tokens and preview themes to Storybook.
* Added loader component to Storybook.
* [#310] Added basic map component to Storybook.
* Fixed (some) proptype warnings in tests.
* [#3067] Added submission completion component to Storybook.
* Refactored components to retrieve data via context instead of props, to make them more
  suitable for react-router's data routers.


1.4.0 (2023-06-21)
==================

SDK for the upcoming Open Forms 2.2 release.

.. warning:: SDK 1.4.0 requires at least version 2.2.0 of the Open Formulieren API.

Features
--------

* [#2789] The text content of the suspend/pause modal is now retrieved from the API.
* [#2240] Added hash fragment routing option, especially interesting for parties
  embedding the SDK in their CMS or SPA/PWA who can't implement catch-all routes.
* [#2788] Renamed/rephrased the form entry point page title to "start page".
* [#2921] Added the form title back to every step page so that both form and step title
  are displayed.
* [#2444] Added option to hide non-applicable steps in the overview/progress indicator.
* [#2863] Updated the order of parts in the document title for better accessibility.
* [#3004] Form suspension can now be disabled.
* [#396] Radio, checkbox and selectboxes components can now be themed using NL Design
  System.
* [#1530] Implemented entirely new co-sign flow and deprecated the existing one.
* [#2809] The submission PDF report download link title is now configurable.

* Implemented a number of form components using NL Design System for non-formio forms:

    * [#3057] Text field.
    * [#3059] Email field.
    * [#3058] Number field, with widgets for small and large numbers and localization.
    * [#3061, #420] Select field, with static and dynamically retrieved options.
    * [#3060] Added a datepicker-based date field.
    * [#442] These should all be themeable with the appropriate design tokens - see our
      storybook.

* [#2471, #3062, #3063, #3065, #3067] (experimental) Started appointment form rework UX.

Bugfixes
--------

* [#2760] Fixed checkbox value not being capitalized on summary page.
* [#2077, #2888] Fixed "previous" link and privacy consent checkbox not being reachable
  with keyboard navigation.
* [#2907] Fixed long form names being truncated with an ellipsis - they now wrap.
* [#2903] Fixed unintended clearing of number/currency data with backend logic.
* [#2911] Fixed support for heic/heif file types.
* [#2912] Fixed disappearing file upload drag and drop area after deleting a succesful
  upload.
* [#2909] Fixed the cursors jumping back to the start of email fields.
* [#2905] Fixed overflow being visually cut off in time field.
* [#2939] Fixed co-sign component error 'missing next parameter'.
* [#2813] Fixed inconsistent styling of add-buttons in varous places.
* [#2875] Fixed SiteImprove analytics, for real this time.
* [#2986] Fixed users accidentally restarting a form submission when they navigate back
  to the start page.
* [#2929] Fixed a cache/storage invalidation bug which would sometimes lead to
  authentication errors.
* [#3040] Fixed user-unfriendly validation errors for invalid file-type uploads.
* [#2808] Fixed overflowing filenames in upload validation errors.
* [#3096] Fixed validation errors inadvertedly being removed in repeating groups,
  blocking the form (step) submission.

Project hygiene
---------------

* Fixed MSW relative path for deployed version of storybook.
* [#308] Documented the file upload component in storybook.
* Automated updating the Docker Hub SDK description/README.
* Documented the Form step modal in storybook.
* Removed 1.1.x series from supported versions.
* [#3056] Added ``FormikDecorator`` for storybook to support Formik forms.
* Upgraded to React 18.
* Upgraded to react-router v6.
* Removed a bunch of CSS in favour of NL DS community components.
* Moved developer documentation to be better visible (at the top).
* Refactored some internal components to now use the new components from
  ``components/forms``.
* Documented the appointment cancellation components in Storybook.
* Upgraded react-intl to v6.

1.3.4 (2023-06-21)
==================

Periodic bugfix release

* [#2875] Fixed SiteImprove analytics, for real this time.
* [#2929] Fixed a cache/storage invalidation bug which would sometimes lead to
  authentication errors.
* [#3096] Fixed validation errors inadvertedly being removed in repeating groups,
  blocking the form (step) submission.

1.2.9 (2023-06-21)
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

1.2.8 (2023-04-17)
==================

Periodic bugfix release

* [#2903] Fixed unintended clearing of number/currency data with backend logic
* [#2912] Fixed disappearing file upload drag and drop area after deleting a succesful
  upload.

1.1.4 (2023-04-17)
==================

This release marks the end-of-life (EOL) of the 1.1.x series.

* [#2903] Fixed unintended clearing of number/currency data with backend logic
* [#2912] Fixed disappearing file upload drag and drop area after deleting a succesful
  upload.

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


1.2.7 (2023-03-01)
==================

Security release (low severity)

* [security#22] Fixed additional missing user-input escape when the filename of uploads
  is reflected in backend validation errors.


1.1.3 (2023-03-01)
==================

Security release (low severity)

* [security#19] Escape textarea content to prevent self-XSS.
* [security#22] Fixed additional missing user-input escape when the filename of uploads
  is reflected in backend validation errors.


1.2.6 (2023-02-23)
==================

Security release (low severity)

When HTML is used in the filename of an upload, self-XSS is possible. The impact is
limited when using a content-security policy blocking inline scripts.

* [#1351] Allow negative numbers and currencies
* [security#22] Escape file upload user-generated content to prevent self-XSS.


1.1.2 (2023-02-09)
==================

Periodic maintenance release

* [#1832] Debounce the location autofill API calls
* [#1868] Ensure that invalid data is still kept in the client-side data state (fix
  for new bug in #1526)
* [#1351] Allow negative numbers and currencies
* [security#22] Fixed self-XSS through bad filenames in file-upload component


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


1.2.5 (2023-01-19)
==================

Security release (low severity)

This seemed to only be triggered in form configurations with textareas and data pickers,
while the end-user needs to input malicious content by themselves. Additionally, using
a content-security policy blocking inline scripts severely hinders the exploitability.

* [security#19] Escape textarea content to prevent self-XSS.


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
