// shorthand GetElementById
function getElement(id) { return document.getElementById(id) }

//rounding to decimal place https://stackoverflow.com/a/34796988
function round(value, decimals) {
  return parseFloat(Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals));
}

// check for empty object https://stackoverflow.com/a/32108184
/*function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}*/

function isNullOrEmpty(obj) {
  if (obj === null) return true;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

// VERSIONING
const VERSION = "v0.3.4.2";
getElement('bodytitle').innerText = `ProgressBarGenerator ${VERSION}`;
getElement('headtitle').innerText = `ProgressBarGenerator ${VERSION} | FlyingKatsu`;

// NOTE: output image is double these dimensions
WIDTH = 480;
HEIGHT = 680;
HEADSIZE = 72;
FRAMEHEIGHT = 48;
PAD_RIGHT = 84;
PAD_LEFT = 64;
PAD_TOP = 72;
PAD_BOTTOM = 64;
PLACEHOLDER = {
  src: "https://i.imgur.com/wTSae6Z.png",
  x: 0,
  y: 0,
  w: 128,
  h: 128
};
APPNAME = "ProgressBarGenerator-FK";

getElement('upload-W').value = HEADSIZE;
getElement('upload-H').value = HEADSIZE;
getElement('upload-X').value = WIDTH * 2 / 3 - 4;
getElement('upload-Y').value = PAD_TOP - HEADSIZE / 4;
getElement('spacing').value = 120;

// User Defined Values
let DONORDATA = [];


// DATA STORAGE

APPDATA = {
  version: VERSION,
  layers: {
    bg: "",
    frame: "",
    fill: "",
    text: "",
    head: ""
  },
  canvas: "",
  INPUT: {
    Title: {
      Data: [
        { name: "TIP JAR  //", x: 4, y: 4 },
        { name: "RECENT TIPS  //", x: 4, y: HEIGHT * 3 / 4 }
      ],
      Style: {},
      Font: {
        size: 48,
        font: "Impact, Charcoal, sans-serif",
        x: 0,
        y: 0,
        baseline: "hanging",
        align: "left",
        stroke: 2,
        line: "#000",
        fill: "#FFF",
        gradientA: "#FF0000",
        gradientB: "#FFFF00"
      }
    },
    Headshot: {
      Data: [
        {},
        {},
        {},
        {}
      ],
      Style: {
        Size: { w: HEADSIZE, h: HEADSIZE },
        Position: { x: WIDTH * 2 / 3 - 6, y: 0 }
      },
    },
    Goal: {
      Data: [
        { name: "Sample 1", progress: { a: 0, b: 100 } },
        { name: "Sample 2", progress: { a: 499, b: 500 } },
        { name: "Sample 3", progress: { a: 30, b: 50 } },
        { name: "Sample 4", progress: { a: 10, b: 150 } }
      ],
      Style: {
        Size: { w: 2 / 3 * WIDTH, h: FRAMEHEIGHT },
        Position: { x: 4, y: PAD_TOP },
        Padding: { x: 0, y: 4 }, // Space between progress text and bottom border
        Space: { x: 0, y: 24 },
        Normal: { border: "#000", fill: "#FF0000", size: 4 },
        Filled: { border: "#FFF", fill: "#00FF00", size: 4 },
        Overflow: { border: "#FFF", fill: "#00FF00", size: 6 }
      },
      Font: {
        Name: {
          size: 32,
          font: "Impact, Charcoal, sans-serif",
          x: 12,
          y: 0,
          baseline: "middle",
          align: "left",
          stroke: 1,
          line: "#000",
          fill: "#FFF",
          gradientA: null,
          gradientB: null
        },
        Progress: {
          size: 24,
          font: "Impact, Charcoal, sans-serif",
          x: 0,
          y: 0,
          baseline: "top",
          align: "right",
          stroke: 1,
          line: "#000",
          fill: "#FFF",
          gradientA: null,
          gradientB: null
        },
        Overflow: {
          size: 24,
          font: "Impact, Charcoal, sans-serif",
          x: 0,
          y: 0,
          baseline: "top",
          align: "left",
          stroke: 1,
          line: "#000",
          fill: "#FFF",
          gradientA: null,
          gradientB: null
        }
      }
    },
    Item: {
      Data: [
        { name: "Person", amt: 10, target: 0 },
        { name: "Someone", amt: 20, target: 0 },
        { name: "Another", amt: 15, target: 0 }
      ],
      Style: {
        Position: { x: 0, y: 16 },
        Space: { x: 0, y: 12 }
      },
      Font: {
        size: 28,
        font: "Impact, Charcoal, sans-serif",
        x: 0,
        y: 0,
        baseline: "hanging",
        align: "left",
        stroke: 1,
        line: "#000",
        fill: "#FFF",
        gradientA: null,
        gradientB: null
      }
    }

  }
};


// =========================
// Concrete Setup
// =========================

var canvasWrapper = getElement('canvasWrapper');

var viewport = new Concrete.Viewport({
  width: WIDTH,
  height: HEIGHT,
  container: canvasWrapper
});

viewport.setSize(WIDTH, HEIGHT);

const LAYERS = {
  bg: new Concrete.Layer(),
  frame: new Concrete.Layer(),
  fill: new Concrete.Layer(),
  text: new Concrete.Layer(),
  head: new Concrete.Layer()
}

viewport.add(LAYERS.bg)
  .add(LAYERS.frame)
  .add(LAYERS.fill)
  .add(LAYERS.text)
  .add(LAYERS.head);

let SaveData = function() {
  //APPDATA.canvas = viewport.scene.canvas.toDataURL('image/png');
  //APPDATA.layers.bg = LAYERS.bg.scene.canvas.toDataURL('image/png');
  //APPDATA.layers.frame = LAYERS.frame.scene.canvas.toDataURL('image/png');
  //APPDATA.layers.fill = LAYERS.fill.scene.canvas.toDataURL('image/png');
  //APPDATA.layers.text = LAYERS.text.scene.canvas.toDataURL('image/png');
  //APPDATA.layers.head = LAYERS.head.scene.canvas.toDataURL('image/png');
  localStorage.setItem(APPNAME, JSON.stringify(APPDATA));
}


let drawOnLayer = function(layer, options) {
  let scene = layer.scene;
  let ctx = scene.context;
  //scene.clear();
  ctx.save();
  ctx.fillStyle = options.color;
  ctx.fillRect(options.x, options.y, options.w * options.percent, options.h);
  ctx.restore();
  viewport.render();
}

let drawImageOnLayer = function(layer, img, options) {
  let scene = layer.scene;
  let ctx = scene.context;
  //scene.clear();
  ctx.save();
  ctx.drawImage(img,
    options.cropX, options.cropY,
    options.cropW, options.cropH,
    options.x, options.y,
    options.w, options.h);
  ctx.restore();
  viewport.render();
}

let drawTextOnLayer = function(layer, text, options) {
  let scene = layer.scene;
  let ctx = scene.context;
  //scene.clear();
  ctx.save();
  ctx.lineWidth = options.thick;
  ctx.strokeStyle = options.stroke;
  ctx.fillStyle = options.fill;
  ctx.font = options.font || options.fontsize + "px " + options.fontfamily;
  ctx.font = "italic " + ctx.font;
  ctx.textAlign = options.align || "left";
  ctx.textBaseline = options.baseline || "hanging";
  if (options.miter) ctx.miterLimit = options.miter;
  ctx.fillText(text, options.x, options.y);
  ctx.strokeText(text, options.x, options.y);
  ctx.restore();
  viewport.render();
}

// Test Fonts
function testFonts(txt, font, options) {
  txt.split("\\n").map(
    function(subtxt, i) {
      drawTextOnLayer(LAYERS.text, subtxt, {
        thick: 2,
        stroke: "#000",
        fill: "#fff",
        font: font,
        miter: (options && options.miter) ? options.miter : 10,
        align: "left",
        x: 16,
        y: 32 + 64 * i
      });
    }
  );
}

// Layer Redraws

function CalcSpacing() {
  return APPDATA.INPUT.Goal.Style.Space.y +
    APPDATA.INPUT.Goal.Style.Size.h + APPDATA.INPUT.Goal.Style.Padding.y +
    APPDATA.INPUT.Goal.Font.Progress.size;
}

function RedrawText() {
  LAYERS.text.scene.clear();

  // Draw the titles
  APPDATA.INPUT.Title.Data.map(function(title, i) {
    drawTextOnLayer(LAYERS.text, title.name, {
      thick: APPDATA.INPUT.Title.Font.stroke,
      stroke: APPDATA.INPUT.Title.Font.line,
      fill: APPDATA.INPUT.Title.Font.fill,
      fontsize: APPDATA.INPUT.Title.Font.size,
      fontfamily: APPDATA.INPUT.Title.Font.font,
      align: APPDATA.INPUT.Title.Font.align,
      baseline: APPDATA.INPUT.Title.Font.baseline,
      x: title.x + APPDATA.INPUT.Title.Font.x,
      y: title.y + APPDATA.INPUT.Title.Font.y
    });
  });

  // Draw the goals
  // Precalculate spacing
  let spacing = CalcSpacing();
  APPDATA.INPUT.Goal.Data.map(function(goal, i) {
    let progress = goal.progress.a / goal.progress.b;
    let remainder = goal.progress.b - goal.progress.a;
    let progressTxt = "";
    let font = APPDATA.INPUT.Goal.Font.Progress;
    if (progress > 1) {
      font = APPDATA.INPUT.Goal.Font.Overflow;
      progressTxt = `MAXED OUT by Someone +${-remainder}`;
    } else if (progress == 1) {
      font = APPDATA.INPUT.Goal.Font.Overflow;
      progressTxt = `Someone filled 100%`;
    } else {
      font = APPDATA.INPUT.Goal.Font.Progress;
      progressTxt = `${goal.progress.a} / ${goal.progress.b}`;
    }
    // Goal Name
    drawTextOnLayer(LAYERS.text, goal.name, {
      thick: APPDATA.INPUT.Goal.Font.Name.stroke,
      stroke: APPDATA.INPUT.Goal.Font.Name.line,
      fill: APPDATA.INPUT.Goal.Font.Name.fill,
      fontsize: APPDATA.INPUT.Goal.Font.Name.size,
      fontfamily: APPDATA.INPUT.Goal.Font.Name.font,
      align: APPDATA.INPUT.Goal.Font.Name.align,
      baseline: APPDATA.INPUT.Goal.Font.Name.baseline,
      x: APPDATA.INPUT.Goal.Style.Position.x + APPDATA.INPUT.Goal.Font.Name.x,
      y: APPDATA.INPUT.Goal.Style.Position.y + APPDATA.INPUT.Goal.Font.Name.y + APPDATA.INPUT.Goal.Style.Size.h / 2 + spacing * i
    });
    // Goal Progress
    drawTextOnLayer(LAYERS.text, progressTxt, {
      thick: font.stroke,
      stroke: font.line,
      fill: font.fill,
      fontsize: font.size,
      fontfamily: font.font,
      align: APPDATA.INPUT.Goal.Font.Progress.align,
      baseline: APPDATA.INPUT.Goal.Font.Progress.baseline,
      x: APPDATA.INPUT.Goal.Font.Progress.x + APPDATA.INPUT.Goal.Style.Size.w,
      y: APPDATA.INPUT.Goal.Style.Position.y + APPDATA.INPUT.Goal.Font.Progress.y + APPDATA.INPUT.Goal.Style.Size.h + APPDATA.INPUT.Goal.Style.Padding.y + spacing * i
    });
  });

  // Draw the list items
  APPDATA.INPUT.Item.Data.map(function(item, i) {
    drawTextOnLayer(LAYERS.text, `${item.name}: $${item.amt}`, {
      thick: APPDATA.INPUT.Item.Font.stroke,
      stroke: APPDATA.INPUT.Item.Font.line,
      fill: APPDATA.INPUT.Item.Font.fill,
      fontsize: APPDATA.INPUT.Item.Font.size,
      fontfamily: APPDATA.INPUT.Item.Font.font,
      align: APPDATA.INPUT.Item.Font.align,
      baseline: APPDATA.INPUT.Item.Font.baseline,
      x: APPDATA.INPUT.Title.Data[1].x + APPDATA.INPUT.Item.Style.Position.x + APPDATA.INPUT.Item.Font.x,
      y: APPDATA.INPUT.Title.Data[1].y + APPDATA.INPUT.Title.Font.size + APPDATA.INPUT.Item.Style.Position.y + APPDATA.INPUT.Item.Font.y + (APPDATA.INPUT.Item.Font.size + APPDATA.INPUT.Item.Style.Space.y) * i
    });
  });
}

function RedrawProgressBar() {
  LAYERS.frame.scene.clear();
  LAYERS.fill.scene.clear();

  // Precalculate spacing
  let spacing = CalcSpacing();

  APPDATA.INPUT.Goal.Data.map(function(goal, i) {
    let progress = goal.progress.a / goal.progress.b;
    let percent = 1;
    let remainder = goal.progress.b - goal.progress.a;
    let style = APPDATA.INPUT.Goal.Style.Normal;
    if (progress > 1) {
      style = APPDATA.INPUT.Goal.Style.Overflow;
      percent = -remainder / goal.progress.b;
    } else if (progress == 1) {
      style = APPDATA.INPUT.Goal.Style.Filled;
    } else {
      style = APPDATA.INPUT.Goal.Style.Normal;
      percent = progress;
    }
    // Goal Frame
    drawOnLayer(LAYERS.frame, {
      x: APPDATA.INPUT.Goal.Style.Position.x,
      y: APPDATA.INPUT.Goal.Style.Position.y + spacing * i,
      w: APPDATA.INPUT.Goal.Style.Size.w,
      h: APPDATA.INPUT.Goal.Style.Size.h,
      color: APPDATA.INPUT.Goal.Style.Normal.border,
      percent: 1
    });
    // Extra Goal Fill
    if (progress > 1) {
      drawOnLayer(LAYERS.fill, {
        x: APPDATA.INPUT.Goal.Style.Position.x + APPDATA.INPUT.Goal.Style.Filled.size,
        y: APPDATA.INPUT.Goal.Style.Position.y + APPDATA.INPUT.Goal.Style.Filled.size + spacing * i,
        w: APPDATA.INPUT.Goal.Style.Size.w - APPDATA.INPUT.Goal.Style.Filled.size * 2,
        h: APPDATA.INPUT.Goal.Style.Size.h - APPDATA.INPUT.Goal.Style.Filled.size * 2,
        color: APPDATA.INPUT.Goal.Style.Filled.border,
        percent: 1
      });
    }
    // Goal Fill
    drawOnLayer(LAYERS.fill, {
      x: APPDATA.INPUT.Goal.Style.Position.x + style.size,
      y: APPDATA.INPUT.Goal.Style.Position.y + style.size + spacing * i,
      w: APPDATA.INPUT.Goal.Style.Size.w - style.size * 2,
      h: APPDATA.INPUT.Goal.Style.Size.h - style.size * 2,
      color: APPDATA.INPUT.Goal.Style.Normal.fill,
      percent: percent
    });
  });
}

function RedrawHeadshot() {
  LAYERS.head.scene.clear();
  // Precalculate spacing
  let spacing = CalcSpacing();
  let centering = (APPDATA.INPUT.Goal.Style.Size.h - APPDATA.INPUT.Headshot.Style.Size.h) / 2;
  // Draw the headshots
  APPDATA.INPUT.Headshot.Data.map(function(headshot, i) {
    if (isNullOrEmpty(headshot)) headshot = PLACEHOLDER;
    let id = `upload-${(i + 1)}`;
    let img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
      drawImageOnLayer(LAYERS.head, img, {
        x: APPDATA.INPUT.Headshot.Style.Position.x,
        y: APPDATA.INPUT.Headshot.Style.Position.y + APPDATA.INPUT.Goal.Style.Position.y + centering + spacing * i,
        w: APPDATA.INPUT.Headshot.Style.Size.w,
        h: APPDATA.INPUT.Headshot.Style.Size.h,
        cropX: headshot.x || PLACEHOLDER.x,
        cropY: headshot.y || PLACEHOLDER.y,
        cropW: headshot.w || PLACEHOLDER.w,
        cropH: headshot.h || PLACEHOLDER.h
      });
    };
    img.src = headshot.src || PLACEHOLDER.src;
  });
  SaveData();
}

// =========================
// Button Controls
// =========================

function drawHeadshot(src, i) {
  let img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = src;
  let id = `upload-${(i + 1)}`;
  img.onload = function() {
    drawImageOnLayer(LAYERS.head, img, {
      x: getElement(`upload-X`).value,
      // y: getElement('upload-Y').value + i * getElement(`spacing`).value,
      y: PAD_TOP - HEADSIZE / 4 + i * getElement(`spacing`).value,
      w: getElement(`upload-W`).value,
      h: getElement(`upload-H`).value,
      cropX: getElement(`${id}-cropX`).value,
      cropY: getElement(`${id}-cropY`).value,
      cropW: getElement(`${id}-cropW`).value,
      cropH: getElement(`${id}-cropH`).value
    });
  };
}

function updateHeadshots() {
  LAYERS.head.scene.clear();
  for (let i = 0; i < 4; i++) {
    let id = `upload-${(i + 1)}`;
    let e = getElement(id + '-img');
    if (e) {
      drawHeadshot(e.src, i);
    } else {
      getElement(id + '-preview').innerHTML = `<img id="${id}-img" src="${PLACEHOLDER.src}">`;
      getElement(id + '-cropX').value = 0;
      getElement(id + '-cropY').value = 0;
      getElement(id + '-cropW').value = 128;
      getElement(id + '-cropH').value = 128;
      drawHeadshot(PLACEHOLDER.src, i);
    }
  }
  // Save to Local
  SaveData();
}

// Draw uploaded image
function drawImageTo(i) {
  let id = `upload-${(i + 1)}`;
  return function() {
    if (this.files && this.files[0]) {
      var FR = new FileReader();
      FR.onload = function(e) {
        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.addEventListener("load", function() {
          getElement(id + '-preview').innerHTML = `<img id="${id}-img" src="${img.src}">`;
          getElement(id + '-cropX').value = 0;
          getElement(id + '-cropY').value = 0;
          getElement(id + '-cropW').value = img.naturalWidth;
          getElement(id + '-cropH').value = img.naturalHeight;
          APPDATA.INPUT.Headshot.Data[i].src = img.src;
          APPDATA.INPUT.Headshot.Data[i].x = 0;
          APPDATA.INPUT.Headshot.Data[i].y = 0;
          APPDATA.INPUT.Headshot.Data[i].w = img.naturalWidth;
          APPDATA.INPUT.Headshot.Data[i].h = img.naturalHeight;
          getElement(`${id}-url`).value = null;
          RedrawHeadshot();
        });
        img.src = e.target.result;
      };
      FR.readAsDataURL(this.files[0]);
    }
  }
}

function drawImageURLTo(i) {
  return function() {
    let id = `upload-${(i + 1)}`;
    let e = getElement(`${id}-url`);
    let url = e.value || "";
    if (url) url = url.replace(/\s/g, '');
    if (url.length > 0) {
      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.addEventListener("load", function() {
        getElement(id + '-preview').innerHTML = `<img id="${id}-img" src="${img.src}">`;
        getElement(id + '-cropX').value = 0;
        getElement(id + '-cropY').value = 0;
        getElement(id + '-cropW').value = img.naturalWidth;
        getElement(id + '-cropH').value = img.naturalHeight;
        APPDATA.INPUT.Headshot.Data[i].src = img.src;
        APPDATA.INPUT.Headshot.Data[i].x = 0;
        APPDATA.INPUT.Headshot.Data[i].y = 0;
        APPDATA.INPUT.Headshot.Data[i].w = img.naturalWidth;
        APPDATA.INPUT.Headshot.Data[i].h = img.naturalHeight;
        getElement(`error-${i+1}`).value = "";
        getElement(id).value = null;
        RedrawHeadshot();
      });
      img.addEventListener("error", function(e, err) {
        console.log(err);
        getElement(`error-${i+1}`).value = "Unable to load image from URL.";
      });
      img.src = url;
    } else { console.log("no img url found"); }
  };
}

function ConvertType(v, type) {
  if (type == "int") { return parseInt(v); } else if (type == "num") { return Number(v); } else { return v; }
}

function UpdateProperty(path, type) {
  return function() {
    // Dynamically find the property to update https://stackoverflow.com/a/18937118
    let schema = APPDATA.INPUT;
    const pathsplit = path.split('.');
    const len = pathsplit.length;
    for (let i = 0; i < len - 1; i++) {
      const key = pathsplit[i];
      if (!schema[key]) schema[key] = {}
      schema = schema[key];
    }
    // Update the value
    schema[pathsplit[len - 1]] = ConvertType(this.value, type);
    RedrawProgressBar();
    RedrawText();
    RedrawHeadshot();
  }
}

function UpdateHeadshotData(i, key, type) {
  return function() {
    // Update the value
    APPDATA.INPUT.Headshot.Data[i][key] = ConvertType(this.value, type);
    RedrawHeadshot();
  }
}

function UpdateGoalData(i, path, type) {
  return function() {
    let schema = APPDATA.INPUT.Goal.Data[i];
    const pathsplit = path.split('.');
    const len = pathsplit.length;
    for (let i = 0; i < len - 1; i++) {
      const key = pathsplit[i];
      if (!schema[key]) schema[key] = {}
      schema = schema[key];
    }
    // Update the value
    schema[pathsplit[len - 1]] = ConvertType(this.value, type);
    RedrawProgressBar();
    RedrawText();
  }
}

function UpdateTitleData(i, path, type) {
  return function() {
    let schema = APPDATA.INPUT.Title.Data[i];
    const pathsplit = path.split('.');
    const len = pathsplit.length;
    for (let i = 0; i < len - 1; i++) {
      const key = pathsplit[i];
      if (!schema[key]) schema[key] = {}
      schema = schema[key];
    }
    // Update the value
    schema[pathsplit[len - 1]] = ConvertType(this.value, type);
    RedrawText();
  }
}

// Add Event Listeners

getElement('ShowSettings').addEventListener("click", () => {
  getElement('data').style.display = 'none';
  getElement('settings').style.display = 'block';
  getElement('gapi').style.display = 'none';
});
getElement('ShowData').addEventListener("click", () => {
  getElement('data').style.display = 'block';
  getElement('settings').style.display = 'none';
  getElement('gapi').style.display = 'none';
});
getElement('ShowGAPI').addEventListener("click", () => {
  getElement('data').style.display = 'none';
  getElement('settings').style.display = 'none';
  getElement('gapi').style.display = 'block';
});

getElement('upload-W').addEventListener("change", UpdateProperty("Headshot.Style.Size.w", "int"), false);
getElement('upload-H').addEventListener("change", UpdateProperty("Headshot.Style.Size.h", "int"), false);
getElement('upload-X').addEventListener("change", UpdateProperty("Headshot.Style.Position.x", "int"), false);
getElement('upload-Y').addEventListener("change", UpdateProperty("Headshot.Style.Position.y", "int"), false);
getElement('spacing').addEventListener("change", UpdateProperty("Goal.Style.Space.y", "int"), false);

for (let i = 0; i < 4; i++) {
  let id = `upload-${(i + 1)}`;
  getElement(id).addEventListener("change", drawImageTo(i), false);
  getElement(`${id}-url`).addEventListener("change", drawImageURLTo(i));
  getElement(`${id}-cropX`).addEventListener("change", UpdateHeadshotData(i, "x", "int"), false);
  getElement(`${id}-cropY`).addEventListener("change", UpdateHeadshotData(i, "y", "int"), false);
  getElement(`${id}-cropW`).addEventListener("change", UpdateHeadshotData(i, "w", "int"), false);
  getElement(`${id}-cropH`).addEventListener("change", UpdateHeadshotData(i, "h", "int"), false);
}

for (let i = 0; i < 4; i++) {
  let id = `goal-${(i + 1)}`;
  getElement(id).addEventListener("change", UpdateGoalData(i, "name", "string"), false);
  getElement(`${id}-A`).addEventListener("change", UpdateGoalData(i, "progress.a", "string"), false);
  getElement(`${id}-B`).addEventListener("change", UpdateGoalData(i, "progress.b", "string"), false);
}

for (let i = 0; i < 2; i++) {
  let id = `title-${(i + 1)}`;
  getElement(id).addEventListener("change", UpdateTitleData(i, "name", "string"), false);
}

// Download using APPDATA.INPUT filename
getElement('download').addEventListener('click', function() {
  // Download file
  viewport.scene.download({
    fileName: getElement('filename').value || 'genTipJarProgress.png'
  });
});

getElement('font-size').addEventListener('change', function() {
  LAYERS.text.scene.clear();
  testFonts(getElement('font-sample').value, getElement('font-size').value + 'px ' + getElement('font-family').value, { miter: getElement('miter').value });
});

getElement('miter').addEventListener('change', function() {
  LAYERS.text.scene.context.miterLimit = getElement('miter').value;
  LAYERS.text.scene.clear();
  testFonts(getElement('font-sample').value, getElement('font-size').value + 'px ' + getElement('font-family').value, { miter: getElement('miter').value });
});

getElement('miter2').addEventListener('change', RedrawText);

getElement('font-sample').addEventListener('change', function() {
  LAYERS.text.scene.clear();
  testFonts(getElement('font-sample').value, getElement('font-size').value + 'px ' + getElement('font-family').value, { miter: getElement('miter').value });
});

getElement('font-family').addEventListener('change', function() {
  getElement('font-family').style = `font-family: ${getElement('font-family').value}; font-style: italic;`;
  LAYERS.text.scene.clear();
  testFonts(getElement('font-sample').value, getElement('font-size').value + 'px ' + getElement('font-family').value, { miter: getElement('miter').value });
});

function ResetCanvas() {
  LAYERS.head.scene.clear();
  LAYERS.text.scene.clear();
  LAYERS.frame.scene.clear();
  LAYERS.fill.scene.clear();
  LAYERS.bg.scene.clear();
  viewport.scene.clear();
  RedrawProgressBar();
  RedrawText();
  RedrawHeadshot();
}
getElement('reset').addEventListener('click', ResetCanvas);

// Add Donations
getElement('donate').addEventListener('click', function() {
  let index = getElement('donations').children.length;
  let html = `<label for="donor">Donor Name</label>
    <APPDATA.INPUT type="text" name="donor" value="Somebody" onchange="updateDonor(${index})">
    <label for="amt">Amount</label>
    <APPDATA.INPUT type="number" name="amt" min=0.00 step=0.05 value="5.00" onchange="applyDonation(${index})">
    <label for="target">Target</label>
    <select name="target" onchange="applyDonation(${index})">
          <option disabled selected value> -- select a goal -- </option>
          <option value="1">Goal 1</option>
          <option value="2">Goal 2</option>
          <option value="3">Goal 3</option>
          <option value="4">Goal 4</option>
      </select>`;
  let fieldset = document.createElement('fieldset');
  fieldset.innerHTML = html;
  getElement('donations').appendChild(fieldset);
});

function applySpread(goals, target, tarAmt, spreadAmt) {
  for (let i = 0; i < goals.length; i++) {
    let current = goals[i].elements["goal-" + (i + 1) + "-A"];
    if ((i + 1) == target) {
      current.value = round(parseFloat(current.value) + tarAmt, 2);
    } else {
      current.value = round(parseFloat(current.value) + spreadAmt, 2);
    }
  }
}

function updateDonor(index) {
  let donation = getElement('donations').children[index];
  let name = donation.elements['donor'].value;
  if (DONORDATA[index]) {
    DONORDATA[index].name = name;
  }
}

// Apply changes to Donation slots
let applyDonation = function(index) {
  let donation = getElement('donations').children[index];
  let name = donation.elements['donor'].value;
  let amt = donation.elements['amt'].value;
  let target = donation.elements['target'].value;
  let split = getElement('split').value;

  // Skip if target not set
  if (!target) return;

  let data = {
    name: name,
    amt: amt,
    target: target,
    split: split,
    tarAmt: round(amt * split, 2),
    spreadAmt: round(amt * (1 - split) / 3, 2)
  };

  let goals = getElement('goals').children;

  if (!DONORDATA[index]) {
    // Save the new data
    DONORDATA.push(data);
    // update Goals
    applySpread(goals, data.target, data.tarAmt, data.spreadAmt);

  } else {
    // If changing the target, undo old and apply new
    if (target != DONORDATA[index].target) {
      // Remove old
      applySpread(goals, DONORDATA[index].target, -DONORDATA[index].tarAmt, -DONORDATA[index].spreadAmt);
      // Apply new
      applySpread(goals, data.target, data.tarAmt, data.spreadAmt);

    } else { // Otherwise calculate the difference and update
      // Get Diff
      let diffTarget = data.tarAmt - DONORDATA[index].tarAmt;
      let diffSpread = data.spreadAmt - DONORDATA[index].spreadAmt;
      // update Goals
      applySpread(goals, data.target, diffTarget, diffSpread);
      // update data
      DONORDATA[index] = data;
    }
  }
  // Redraw goals
  updateGoalTextLayers();
};

// Preload fonts into cache for quicker display
testFonts('//ABCDEFGHIJK\nLMNOPQRSTUVWXYZ\n!@#$%^*()[]', '32px sans-serif');
testFonts('//ABCDEFGHIJK\nLMNOPQRSTUVWXYZ\n!@#$%^*()[]', '32px Impact, Charcoal, sans-serif');
testFonts('//ABCDEFGHIJK\nLMNOPQRSTUVWXYZ\n!@#$%^*()[]', '32px Exo Black Italic');
testFonts('//ABCDEFGHIJK\nLMNOPQRSTUVWXYZ\n!@#$%^*()[]', '32px Kanit Black Italic');
testFonts('//ABCDEFGHIJK\nLMNOPQRSTUVWXYZ\n!@#$%^*()[]', '32px Open Sans Extra Bold Italic');
LAYERS.text.scene.clear();

function RestoreFieldData() { // TODO: Create the HTML elements needed
  // Text Settings TODO

  // Text Data
  APPDATA.INPUT.Title.Data.map(function(title, i) {
    let id = `title-${(i + 1)}`;
    getElement(id).value = title.name;
    getElement(`${id}-X`).value = title.x;
    getElement(`${id}-Y`).value = title.y;
  });
  APPDATA.INPUT.Goal.Data.map(function(goal, i) {
    let id = `goal-${(i + 1)}`;
    getElement(id).value = goal.name;
    getElement(`${id}-A`).value = goal.progress.a;
    getElement(`${id}-B`).value = goal.progress.b;
  });
  // Image Settings
  getElement('upload-W').value = APPDATA.INPUT.Headshot.Style.Size.w;
  getElement('upload-H').value = APPDATA.INPUT.Headshot.Style.Size.h;
  getElement('upload-X').value = APPDATA.INPUT.Headshot.Style.Position.x;
  getElement('upload-Y').value = APPDATA.INPUT.Headshot.Style.Position.y;
  getElement('spacing').value = APPDATA.INPUT.Goal.Style.Space.y;
  // Image Data
  APPDATA.INPUT.Headshot.Data.map(function(headshot, i) {
    if (isNullOrEmpty(headshot)) headshot = PLACEHOLDER;
    let id = `upload-${(i + 1)}`;
    getElement(id + '-preview').innerHTML = `<img id="${id}-img" src="${headshot.src || PLACEHOLDER.src}">`;
    // getElement(`${id}-url`).value = headshot.src || PLACEHOLDER.src; // laggy if stored a 'data:' url
    getElement(id + '-cropX').value = headshot.x || PLACEHOLDER.x;
    getElement(id + '-cropY').value = headshot.y || PLACEHOLDER.y;
    getElement(id + '-cropW').value = headshot.w || PLACEHOLDER.w;
    getElement(id + '-cropH').value = headshot.h || PLACEHOLDER.h;
  });
}

// =========================
// Restore Canvas
// =========================
if (!isNullOrEmpty(localStorage.getItem(APPNAME))) {
  // TODO RestoreData from LocalStorage with validity checks
  APPDATA = JSON.parse(localStorage.getItem(APPNAME));
  if (APPDATA.version == VERSION) {
    console.log("Restoring saved data...");
    RedrawProgressBar();
    RedrawText();
    RedrawHeadshot();
    RestoreFieldData();
  } else {
    console.log("Updating version... previous data may be lost");
    // TODO: Backwards compatible support
    APPDATA.version = VERSION;
    ResetCanvas();
    RestoreFieldData();
  }
} else {
  console.log("No existing data found. Populating with placeholders...");
  RedrawProgressBar();
  RedrawText();
  RedrawHeadshot();
  RestoreFieldData();
}