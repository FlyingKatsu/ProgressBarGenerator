// =============================================================
//   UTILITIES: getByID, toggle
// =============================================================

var getByID = function(id) {
  return document.getElementById(id);
};

var toggle = function(evt, e, label) {
  let disp = e.style.display;
  if (disp == "none") {
    e.style.display = "block";
    evt.target.innerText = `Hide ${label}`;
  } else {
    e.style.display = "none";
    evt.target.innerText = `Show ${label}`;
  }
};

var toggleID = function(evt, id, label) {
  // Get the specified element
  let e = getByID(id);
  // Toggle display
  toggle(evt, e, label);
};

var toggleNext = function(evt, n, label) {
  // Get the nth next element
  let e = evt.target.nextElementSibling;
  for (let i = 0; i < n; i++) { e = e.nextElementSibling; }
  // Toggle display
  toggle(evt, e, label);
};

var togglePrev = function(evt, n, label) {
  // Get the nth previous element
  let e = evt.target.previousElementSibling;
  for (let i = 0; i < n; i++) { e = e.previousElementSibling; }
  // Toggle display
  toggle(evt, e, label);
};

// =============================================================
//   DATA MODELS
// =============================================================

/**
 * The Gradient Factory (use in draw methods when gradient data exists).
 * Returns a Context2D Gradient object with _input data.
 * Defaults to evenly-spaced vertical clear-to-black 100px gradient.
 * @param {*} _input The data specifying a gradient
 * @param {*} ctx A Canvas Context2D
 */
const CreateGradient = function(_input, ctx) {
  // Set up defaults
  let input = _input || {};
  data.shape = _input.shape || 'linear'; // radial or linear
  data.colors = _input.colors || [];
  data.start = _input.start || { x: 0, y: 0, r: 0 };
  data.end = _input.end || { x: 100, y: 0, r: 0 };
  // Create the gradient shape as radial or linear
  let gradient = (data.shape == 'radial') ? ctx.createRadialGradient() : ctx.createLinearGradient();
  // Add the color stops
  this.colors.map(function(color) {
    gradient.addColorStop(color.loc, color.value);
  });
  return gradient;
}

/**
 * Convert a hexidecimal color string into rgba string
 * @param {string} hex A string of six characters 0-9a-f preceeded by #
 * @param {number} alpha A number [0,1]
 * From https://stackoverflow.com/a/28056903
 */
const Hex2Rgba = function(hex, alpha) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
};

const StrokeObj = function(_input) {
  let input = _input || {};
  this.width = _input.width || 1;
  this.color = _input.color || '#000000';
  this.alpha = _input.alpha || 1;
  this.gradient = _input.gradient || null;
};

const FillObj = function(_input) {
  let input = _input || {};
  this.color = _input.color || '#ffffff';
  this.alpha = _input.alpha || 0.5;
  this.gradient = _input.gradient || null;
};

const FontObj = function(_input) {
  let input = _input || {};
  this.size = _input.size || 64;
  this.family = _input.family || 'sans-serif';
  this.alignment = _input.alignment || 'center';
  this.baseline = _input.baseline || 'alphabetic';
  this.stroke = _input.stroke || new StrokeObj();
  this.fill = _input.fill || new FillObj();
  this.miter = _input.miter || 10;
};

const PolyObj = function(_input) {
  let input = _input || {};
  this.width = _input.width || 128;
  this.height = _input.height || 32;
  this.shape = _input.shape || 'rectangular';
  this.stroke = _input.stroke || new StrokeObj();
  this.fill = _input.fill || new FillObj();
};

const ImgObj = function(_input) {
  let input = _input || {};
  this.data = _input.data || null;
  this.width = _input.width || 128;
  this.height = _input.height || 128;
  this.crop = _input.crop || { x: 0, y: 0, w: 128, h: 128 };
};

const MODEL = {
  Font: FontObj,
  Img: ImgObj,
  Poly: PolyObj,
  Stroke: StrokeObj,
  Fill: FillObj
};

// =============================================================
//   CONCRETE JS SETUP
// =============================================================

let viewport = new Concrete.Viewport({
  width: 280,
  height: 320,
  container: getByID('canvas')
});

let bgLayer = new Concrete.Layer();
let frameLayer = new Concrete.Layer();
let fillLayer = new Concrete.Layer();
let textLayer = new Concrete.Layer();

viewport.add(bgLayer)
  .add(frameLayer)
  .add(fillLayer)
  .add(textLayer);

// =============================================================
//   ADDITIONAL DRAW METHODS
// =============================================================



// =============================================================
//   UPDATE METHODS
// =============================================================