# ProgressBarGenerator

Currently in rough development on a whim. Uses HTML5 canvas, JavaScript, and [Concrete.js](http://www.concretejs.com/)

https://flyingkatsu.github.io/ProgressBarGenerator/

![preview](https://i.imgur.com/eClFggK.png)

## Change Log

### Version 0.3.x

- (0.3.6) Donations can be cleared, saved, and restored. Goals get donation logs.
- (0.3.6) Re-Add support for Simulated Donations which was broken somewhere around v0.3.4
- (0.3.5) Title and goal text data now saved locally and restored on page load.
- (0.3.5) Separate tabs for Goal Data, Appearance, and (WIP) Donations/Google API
- (0.3.4) Headshot data and settings are now saved locally and restored on page load. Yay!
- (0.3.3) Consolidated local storage for this app
- (0.3.2) Adjusted appearance of headshots

### Version 0.2.0

[WIP Preview](https://flyingkatsu.github.io/ProgressBarGenerator/section.html)

The main JavaScript file is loaded after the HTML page is finished loading. This should not affect most users, but if you do not see a canvas box, check your browser compatibility for [defer on CanIUse](http://caniuse.com/#feat=script-defer)

#### Changes and Fixes

- LOTS OF STUFF

#### Known Issues

- To Be Continued


### Version 0.1.x

#### Changes and Fixes

- Current values are now rounded to 2 decimal places in the visualization (0.1.10)
- Main script is now loaded using `defer` which may not be supported in all browsers. See [CanIUse](http://caniuse.com/#feat=script-defer) (0.1.9)
- Added functionality for calculating newly added donations, splitting by a given percentage. This will update both the visuals and the HTML form values (0.1.9)
- Headshots are redrawn whenever any headshot changes (0.1.8)
- Layers are saved and restored separately (0.1.8)
- Default canvas shows current HTML values instead of sample text (0.1.7)
- Added Impact Italic as the default font (0.1.7)
- Added two more goal text inputs, a separate miter input for title/goal text, and consolidated update functions for title text, goal text, and progress values (0.1.6)
- Updated the goal and title text updates to use the specified miterLimit (0.1.5)
- Fixed missing font reference introduced in 0.1.2 (0.1.5)
- Added miterLimit input for adjusting sharp corner artifacts in rendered font strokes (0.1.4)
- Added fonts using generated kit from FontSquirrel (0.1.2,0.1.3)
- Added INPUT data object for storing the user's settings and text
- Added a `RedrawText()` helper method for updating all text objects in the canvas, using data from INPUT
- Added 4 Google Fonts available for use
    - Preloaded into cache (fixes v0.0.0 issue 1)
    - Font tester UI for previewing different fonts, font size, sample text (with `\n` line break support)
- Added `Clear Canvas` button to work with a clean canvas
- Updated HTML info
    - BareBones `PAGE TITLE` is now `ProgressBarGenerator v0.1.0 | FlyingKatsu`
    - H1 Title matches Page Title
    - Added link to GitHub page

#### Known Issues

- [ ] Because HTML form values are not yet saved, uploading a headshot will clear the layer of any other headshots restored from local storage (0.1.8)
- [x] (fixed in v0.1.3) Web fonts do not render on mobile devices
- [x] (fixed in v0.1.1) Clearing canvas does not clear all layers, so if frameLayer or fillLayer have stuff, they return when the viewport is restored (ie using the font tester), even after clearing the viewport scene with `Clear Canvas`
- [ ] Data-Driven input object is not updated by the current UI form inputs
- [x] (removed in v0.1.7) `RedrawText()` is only used on page load so it can only be viewed cleanly on page load if the local storage is cleared
- [x] (fixed in v0.1.4) Some fonts have undesirable visual artifacts at small sizes
- [ ] No support for custom fonts (must use those available to browser or in the dropdown)
- [ ] Canvas does not resize automatically when text/images are out of bounds
- [ ] All remaining previously known issues

### Version 0.0.0

#### Changes

- Download the canvas as a PNG file and save the image in local storage
- Load image into canvas from local storage
- Interactive form inputs
    - Title text
    - Goal text (2), evenly spaced vertically
    - Progress bar graphic (2), positioned under associated goal text
    - Image data (4) cropped to 48x48 pixels, evenly spaced vertically

#### Known Issues

- [x] (fixed in v0.1.0) Google Font is not loaded until late, so text may not appear as desired at first
- [x] (fixed in v0.1.0) Changing the title text clears the entire text layer
- [x] (fixed in v0.1.6) Goals are not updated unless the goal text changes (there is no listener for progress number changes)
- [ ] The six number fields in each Headshot section don't do anything yet (later they will allow for custom cropping)
- [x] (fixed in v0.1.8) Layers are not stored separately in local storage, and their data is not stored/preloaded to populate fields
- [x] (fixed in v0.1.8) Layer data is not stored internally (so it is never cleared to avoid erasing unrelated pixels), so replacing a headshot won't fully clear the pixels from the old headshot
