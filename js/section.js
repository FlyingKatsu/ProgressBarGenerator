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
//   DATA MODEL
// =============================================================

const StrokeObj = function(_input) {
  let input = _input || {};
  this.width = _input.width || 1;
  this.color = _input.color || '#000000';
  this.alpha = _input.alpha || 1;
};

const FillObj = function(_input) {
  let input = _input || {};
  this.color = _input.color || '#ffffff';
  this.alpha = _input.alpha || 0.5;
  this.direction = _input.direction || 'vertical';
  this.gradient = [
    { color: '#000000', alpha: 1, loc: 0.5 },
    { color: '#ffffff', alpha: 1, loc: 0.75 }
  ];
};

const FontObj = function(_input) {
  let input = _input || {};
  this.size = _input.size || 64;
  this.family = _input.family || 'sans-serif';
  this.alignment = _input.alignment || 'center';
  this.baseline = _input.baseline || 'alphabetic';
  this.stroke = _input.stroke || new StrokeObj();
  this.fill = _input.fill || new FillObj();
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
//   DRAW METHODS
// =============================================================



// =============================================================
//   UPDATE METHODS
// =============================================================