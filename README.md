# ProgressBarGenerator

Currently in rough development on a whim.

## Known Issues

- Google Font is not loaded until late, so text may not appear as desired at first
- Changing the title text clears the entire text layer
- Goals are not updated unless the goal text changes (there is no listener for progress number changes)
- The six number fields in each Headshot section don't do anything yet (later they will allow for custom cropping)
- Layers are not stored separately in local storage, and their data is not stored/preloaded to populate fields
- Layer data is not stored internally (so it is never cleared to avoid erasing unrelated pixels), so replacing a headshot won't fully clear the pixels from the old headshot
