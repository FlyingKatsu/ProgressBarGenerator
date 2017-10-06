# ProgressBarGenerator

Currently in rough development on a whim. Uses HTML5 canvas, JavaScript, and [Concrete.js](http://www.concretejs.com/)

## Change Log

### Version 0.1.0, 0.1.1, 0.1.2, 0.1.3

#### Changes and Fixes

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

- [x] (fixed in v0.1.3) Web fonts do not render on mobile devices
- [x] (fixed in v0.1.1) Clearing canvas does not clear all layers, so if frameLayer or fillLayer have stuff, they return when the viewport is restored (ie using the font tester), even after clearing the viewport scene with `Clear Canvas`
- [ ] Data-Driven input object is not updated by the current UI form inputs
- [ ] `RedrawText()` is only used on page load so it can only be viewed cleanly on page load if the local storage is cleared
- [ ] Some fonts have undesirable visual artifacts at small sizes
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
- [ ] Goals are not updated unless the goal text changes (there is no listener for progress number changes)
- [ ] The six number fields in each Headshot section don't do anything yet (later they will allow for custom cropping)
- [ ] Layers are not stored separately in local storage, and their data is not stored/preloaded to populate fields
- [ ] Layer data is not stored internally (so it is never cleared to avoid erasing unrelated pixels), so replacing a headshot won't fully clear the pixels from the old headshot