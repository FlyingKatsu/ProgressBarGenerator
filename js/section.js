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
  data.shape = input.shape || 'linear'; // radial or linear
  data.colors = input.colors || [];
  data.start = input.start || { x: 0, y: 0, r: 0 };
  data.end = input.end || { x: 100, y: 0, r: 0 };
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
  this.width = input.width || 1;
  this.color = input.color || '#000000';
  this.alpha = input.alpha || 1;
  this.gradient = input.gradient || null;
};

const FillObj = function(_input) {
  let input = _input || {};
  this.color = input.color || '#ffffff';
  this.alpha = input.alpha || 0.5;
  this.gradient = input.gradient || null;
};

const FontObj = function(_input) {
  let input = _input || {};
  this.size = input.size || 64;
  this.family = input.family || 'sans-serif';
  this.alignment = input.alignment || 'center';
  this.baseline = input.baseline || 'alphabetic';
  this.stroke = input.stroke || MODEL.Stroke();
  this.fill = input.fill || MODEL.Fill();
  this.miter = input.miter || 10;
};

const PolyObj = function(_input) {
  let input = _input || {};
  this.width = input.width || 128;
  this.height = input.height || 32;
  this.shape = input.shape || 'rectangular';
  this.stroke = input.stroke || new MODEL.Stroke();
  this.fill = input.fill || new MODEL.Fill();
};

const ImgObj = function(_input) {
  let input = _input || {};
  this.data = input.data || null;
  this.width = input.width || 128;
  this.height = input.height || 128;
  this.crop = input.crop || { x: 0, y: 0, w: 128, h: 128 };
};

const GoalDataObj = function(_input) {
  this.name = "Sample Goal";
  this.current = 75;
  this.max = 100;
  this.img = new MODEL.Img();
  // TODO: Validate _input
};

const GoalObj = function(_input) {
  this.position = { x: 0, y: 0, hs: 0, vs: 0 };
  this.style = {
    font: new MODEL.Font(),
    progress: {
      frame: new MODEL.Poly(),
      fill: new MODEL.Poly()
    }
  };
  this.data = [new MODEL.GoalData()];
  // TODO: Validate _input
};

const TitleObj = function(_input) {
  this.position = { x: 0, y: 0 };
  this.style = { font: new MODEL.Font() };
  this.data = { name: "Sample Title" };
  // TODO: Validate _input
};

const SectionObj = function(_input) {
  this.position = { x: 0, y: 0 };
  this.Title = new MODEL.Title();
  this.Goals = new MODEL.Goal();
  // TODO: Validate _input
};

const CanvasObj = function(_input) {
  this.w = 280;
  this.h = 320;
  this.fill = new MODEL.Fill();
  // TODO: Validate _input
}

const MODEL = {
  Font: FontObj,
  Img: ImgObj,
  Poly: PolyObj,
  Stroke: StrokeObj,
  Fill: FillObj,
  Canvas: CanvasObj,
  Section: SectionObj,
  Title: TitleObj,
  Goal: GoalObj,
  GoalData: GoalDataObj
};

const DATA = {
  Canvas: {
    w: 280,
    h: 320,
    fill: new MODEL.Fill()
  },
  Sections: [{
      position: { x: 0, y: 0 },
      Title: {
        position: { x: 0, y: 0 },
        style: { font: new MODEL.Font() },
        data: { name: "My Title" }
      },
      Goals: {
        position: { x: 0, y: 0, hs: 0, vs: 0 },
        style: {
          font: new MODEL.Font(),
          progress: {
            frame: new MODEL.Poly(),
            fill: new MODEL.Poly()
          },
          img: { frame: new MODEL.Poly() }
        },
        data: [{
            name: "Goal 1",
            current: 50,
            max: 100,
            img: null
          },
          {
            name: "Goal 2",
            current: 75,
            max: 100,
            img: new MODEL.Img()
          }
        ]
      }
    },
    {
      position: { x: 0, y: 0 },
      Title: {
        position: { x: 0, y: 0 },
        style: { font: new MODEL.Font() },
        data: { name: "Another Title" }
      },
      Goals: {
        position: { x: 0, y: 0, hs: 0, vs: 0 },
        style: {
          font: new MODEL.Font(),
          progress: {
            frame: new MODEL.Poly(),
            fill: new MODEL.Poly()
          },
          img: { frame: new MODEL.Poly() }
        },
        data: [
          { name: "Item 1" },
          { name: "Item 2" },
          { name: "Item 3" }
        ]
      }
    }
  ]
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