# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2018-06-30
### Added
* a color validation class, CssColorString, to be used by all sparkline validating colors

### Changed
* replaced color validations to use CssColorString

## [0.1.1] - 2018-06-29
### Changed
* Debugging a build problem with angular-cli
* Removed a debug log statements

## [0.1.0] - 2018-06-28
### Added
* Refactored rms-sparlline-barchart to support positive, negative, dual, and tri charts. Replaced the drawing logic a separate class, providing us with the ability to write extensive unit tests.

### Changed
* Removed default values from rms-sparlline-inline and rms-sparlline-barchart; now a messages is shown, and the web component does nothing.

## [0.0.10-alpha.4] - 2018-06-14
### Changed
* Removed unecessary logic
## [0.0.10-alpha.3] - 2018-06-14
### Changed
* Removed a console.log

## [0.0.10-alpha.2] - 2018-06-14
### Changed
* Fixed Polymer component throws an exception inside the static circle() function #22
** a hack to solve a problem drawing when running inside vaadin-grid

## [0.0.10-alpha.1] - 2018-06-14
### Changed
* Fixed Polymer component throws an exception inside the static circle() function #22
** DrawMethods.circle requires 6 arguments
** DrawMethods.circle requires a !null CanvasRenderingContext2D argument
** DrawMethods.circle requires a !null Point argument

## [0.0.9] - 2018-05-18
### Changed
* rms-sparklines-inline
  * Fixed a README incorrect reference to `linePoints` to be `linepoints`
  * Commented out a console.log statement  in DrawMethods.line

## [0.0.8] - 2018-05-03
### Changed
- rms-sparklines-inline, significant changes, see its README for details
- rms-sparklines-bar-chart, only README 

## [0.0.7] - 2018-05-03
### Changed
- rms-sparkline-inline to fix issue#3: Inline dots chopped in half; see rms-sparkline-inline/README for details on the component changes

## [0.0.1] - 2018-05-01
### Added
* Added a travis.yml file to trigger automated builds and deployment. 

### Changed
* Consolidated all sparkline web components into this single host.
* Refactored the setup script to make it simpler to add a web component


## [0.0.7-alpha.1] - 2018-05-03
### Added
- Created a new class to host drawing methods, DrawMethods; started with a circle.

### Changed
- Fixed a bug on CanvasMath, where the dotRadius needed to be counted twice
- Refactored rms-sparkline-inline to use DrawMethods.circle

### Removed
- N/A

