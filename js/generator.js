// shorthand GetElementById
function getElement(id) { return document.getElementById(id) }

//rounding to decimal place https://stackoverflow.com/a/34796988
function round(value, decimals) {
  return parseFloat(Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals));
}

// VERSIONING
const VERSION = "v0.3.3";
getElement('bodytitle').innerText = `ProgressBarGenerator ${VERSION}`;
getElement('headtitle').innerText = `ProgressBarGenerator ${VERSION} | FlyingKatsu`;

// NOTE: output image is double these dimensions
WIDTH = 480;
HEIGHT = 560;
HEADSIZE = 48;
PAD_RIGHT = 84;
PAD_LEFT = 64;
PAD_TOP = 64;
PAD_BOTTOM = 64;
// https://i.imgur.com/wTSae6Z.png
PLACEHOLDER = "data:image/png;base64,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";
APPNAME = "ProgressBarGenerator-FK";

// User Defined Values
let INPUT = {
  Title: {
    Data: [
      { name: "TITLE TEXT", x: 0, y: 0 },
      { name: "ANOTHER TITLE", x: 0, y: HEIGHT / 2 + 32 }
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
  Goal: {
    Data: [
      { name: "Sample 1", progress: { a: 21, b: 120 }, icon: "" },
      { name: "Sample 2", progress: { a: 21, b: 120 }, icon: "" },
      { name: "Sample 3", progress: { a: 27, b: 45 }, icon: "" },
      { name: "Sample 4", progress: { a: 21, b: 150 }, icon: "" }
    ],
    Style: {
      Position: { x: 0, y: 64 },
      Space: { x: 0, y: 24 }
    },
    Font: {
      Name: {
        size: 32,
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
      },
      Progress: {
        size: 24,
        font: "Impact, Charcoal, sans-serif",
        x: 64,
        y: 0,
        baseline: "hanging",
        align: "right",
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
      "Person: $10",
      "Someone: $20",
      "Another: $15"
    ],
    Style: {
      Position: { x: 0, y: HEIGHT / 2 + 64 + 32 },
      Space: { x: 0, y: 16 }
    },
    Font: {
      size: 32,
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
  settings: {}
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
  APPDATA.canvas = viewport.scene.canvas.toDataURL();
  APPDATA.layers.bg = LAYERS.bg.scene.canvas.toDataURL();
  APPDATA.layers.frame = LAYERS.frame.scene.canvas.toDataURL();
  APPDATA.layers.fill = LAYERS.fill.scene.canvas.toDataURL();
  APPDATA.layers.text = LAYERS.text.scene.canvas.toDataURL();
  APPDATA.layers.head = LAYERS.head.scene.canvas.toDataURL();
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

function RedrawText() {
  LAYERS.text.scene.clear();

  // Draw the titles
  INPUT.Title.Data.map(function(title, i) {
    drawTextOnLayer(LAYERS.text, title.name, {
      thick: INPUT.Title.Font.stroke,
      stroke: INPUT.Title.Font.line,
      fill: INPUT.Title.Font.fill,
      fontsize: INPUT.Title.Font.size,
      fontfamily: INPUT.Title.Font.font,
      align: INPUT.Title.Font.align,
      baseline: INPUT.Title.Font.baseline,
      x: title.x + INPUT.Title.Font.x,
      y: title.y + INPUT.Title.Font.y
    });
  });

  // Draw the goals
  INPUT.Goal.Data.map(function(goal, i) {
    // Goal Name
    drawTextOnLayer(LAYERS.text, goal.name, {
      thick: INPUT.Goal.Font.Name.stroke,
      stroke: INPUT.Goal.Font.Name.line,
      fill: INPUT.Goal.Font.Name.fill,
      fontsize: INPUT.Goal.Font.Name.size,
      fontfamily: INPUT.Goal.Font.Name.font,
      align: INPUT.Goal.Font.Name.align,
      baseline: INPUT.Goal.Font.Name.baseline,
      x: INPUT.Goal.Style.Position.x + INPUT.Goal.Font.Name.x,
      y: INPUT.Goal.Style.Position.y + INPUT.Goal.Font.Name.y + (INPUT.Goal.Font.Name.size + INPUT.Goal.Style.Space.y) * i
    });
    // Goal Progress
    drawTextOnLayer(LAYERS.text, `${goal.progress.a} / ${goal.progress.b}`, {
      thick: INPUT.Goal.Font.Progress.stroke,
      stroke: INPUT.Goal.Font.Progress.line,
      fill: INPUT.Goal.Font.Progress.fill,
      fontsize: INPUT.Goal.Font.Progress.size,
      fontfamily: INPUT.Goal.Font.Progress.font,
      align: INPUT.Goal.Font.Progress.align,
      baseline: INPUT.Goal.Font.Progress.baseline,
      x: WIDTH - INPUT.Goal.Font.Progress.x,
      y: INPUT.Goal.Style.Position.y + INPUT.Goal.Font.Progress.y + (INPUT.Goal.Font.Name.size + INPUT.Goal.Style.Space.y) * i
    });
  });

  // Draw the list items
  INPUT.Item.Data.map(function(item, i) {
    drawTextOnLayer(LAYERS.text, item, {
      thick: INPUT.Item.Font.stroke,
      stroke: INPUT.Item.Font.line,
      fill: INPUT.Item.Font.fill,
      fontsize: INPUT.Item.Font.size,
      fontfamily: INPUT.Item.Font.font,
      align: INPUT.Item.Font.align,
      baseline: INPUT.Item.Font.baseline,
      x: INPUT.Item.Style.Position.x + INPUT.Item.Font.x,
      y: INPUT.Item.Style.Position.y + INPUT.Item.Font.y + (INPUT.Item.Font.size + INPUT.Item.Style.Space.y) * i
    });
  });
}

// =========================
// Button Controls
// =========================

function updateImageInput(id, img) {
  getElement(id + '-preview').innerHTML = `<img id="${id}-img" src="${img.src}">`;
  getElement(id + '-W').value = img.naturalWidth;
  getElement(id + '-H').value = img.naturalHeight;
  getElement(id + '-cropX').value = 0;
  getElement(id + '-cropY').value = 0;
  getElement(id + '-cropW').value = img.naturalWidth;
  getElement(id + '-cropH').value = img.naturalHeight;
}

function drawHeadshot(src, i) {
  let img = new Image();
  img.src = src;
  img.onload = function() {
    drawImageOnLayer(LAYERS.head, img, {
      x: 2 / 3 * WIDTH,
      y: 40 + 120 * i,
      w: 96,
      h: 96,
      cropX: 0,
      cropY: 0,
      cropW: 128,
      cropH: 128
    });
  };
}

function updateHeadshots() {
  console.log("update headshot");
  LAYERS.head.scene.clear();
  for (let i = 0; i < 4; i++) {
    let id = `upload-${(i + 1)}`;
    let e = getElement(id + '-img');
    if (e) {
      console.log("found element");
      drawHeadshot(e.src, i);
    } else {
      console.log("PLACEHOLDER");
      getElement(id + '-preview').innerHTML = `<img id="${id}-img" src="${PLACEHOLDER}">`;
      drawHeadshot(PLACEHOLDER, i);
    }
  }
  // Save to Local
  SaveData();
}

// Draw uploaded image
function drawImageTo(id) {
  return function() {
    if (this.files && this.files[0]) {
      var FR = new FileReader();
      FR.onload = function(e) {
        var img = new Image();
        img.addEventListener("load", function() {
          updateImageInput(id, img);
          updateHeadshots();
        });
        img.src = e.target.result;
      };
      FR.readAsDataURL(this.files[0]);
    }
  }
}

getElement('upload-1').addEventListener("change", drawImageTo('upload-1'), false);
getElement('upload-2').addEventListener("change", drawImageTo('upload-2'), false);
getElement('upload-3').addEventListener("change", drawImageTo('upload-3'), false);
getElement('upload-4').addEventListener("change", drawImageTo('upload-4'), false);

function updateGoalTextLayers() {
  LAYERS.text.scene.clear();
  LAYERS.fill.scene.clear();
  LAYERS.frame.scene.clear();
  drawTextOnLayer(LAYERS.text, getElement('title').value, {
    thick: 2,
    stroke: "#000",
    fill: "#fff",
    font: "48px Impact, Charcoal, sans-serif",
    miter: getElement('miter2').value,
    x: 4,
    y: 4
  });
  for (let i = 0; i < 4; i++) {
    drawOnLayer(LAYERS.frame, {
      x: 4,
      y: PAD_TOP + 6 + 120 * i,
      w: 4 * WIDTH / 6 + 1,
      h: HEADSIZE - 8,
      color: "#000",
      percent: 1
    });
    drawOnLayer(LAYERS.fill, {
      x: 8,
      y: PAD_TOP + 10 + 120 * i,
      w: 4 * WIDTH / 6 - 4 + 1,
      h: HEADSIZE - 16,
      color: "#ff0000",
      percent: getElement('goal-' + (i + 1) + '-A').value / getElement('goal-' + (i + 1) + '-B').value
    });
    drawTextOnLayer(LAYERS.text, getElement('goal-' + (i + 1)).value, {
      thick: 2,
      stroke: "#000",
      fill: "#fff",
      font: "32px Impact, Charcoal, sans-serif",
      miter: getElement('miter2').value,
      x: 16,
      y: PAD_TOP + 13 + 120 * i
    });
    drawTextOnLayer(LAYERS.text, `${getElement('goal-' + (i + 1) + '-A').value} / ${getElement('goal-' + (i + 1) + '-B').value}`, {
      thick: 2,
      stroke: "#000",
      fill: "#fff",
      font: "32px Impact, Charcoal, sans-serif",
      miter: getElement('miter2').value,
      align: "right",
      x: 4 * WIDTH / 6 - 8,
      y: PAD_TOP + 40 + 13 + 120 * i
    });
  }
  // Save in local
  SaveData();
}

// update Title anf Goal Text
getElement('title').addEventListener('change', updateGoalTextLayers);
getElement('goal-1').addEventListener('change', updateGoalTextLayers);
getElement('goal-1-A').addEventListener('change', updateGoalTextLayers);
getElement('goal-1-B').addEventListener('change', updateGoalTextLayers);
getElement('goal-2').addEventListener('change', updateGoalTextLayers);
getElement('goal-2-A').addEventListener('change', updateGoalTextLayers);
getElement('goal-2-B').addEventListener('change', updateGoalTextLayers);
getElement('goal-3').addEventListener('change', updateGoalTextLayers);
getElement('goal-3-A').addEventListener('change', updateGoalTextLayers);
getElement('goal-3-B').addEventListener('change', updateGoalTextLayers);
getElement('goal-4').addEventListener('change', updateGoalTextLayers);
getElement('goal-4-A').addEventListener('change', updateGoalTextLayers);
getElement('goal-4-B').addEventListener('change', updateGoalTextLayers);

// Download using input filename
getElement('download').addEventListener('click', function() {
  // Save in Local Storage
  SaveData();
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

getElement('miter2').addEventListener('change', updateGoalTextLayers);

getElement('font-sample').addEventListener('change', function() {
  LAYERS.text.scene.clear();
  testFonts(getElement('font-sample').value, getElement('font-size').value + 'px ' + getElement('font-family').value, { miter: getElement('miter').value });
});

getElement('font-family').addEventListener('change', function() {
  getElement('font-family').style = `font-family: ${getElement('font-family').value}; font-style: italic;`;
  LAYERS.text.scene.clear();
  testFonts(getElement('font-sample').value, getElement('font-size').value + 'px ' + getElement('font-family').value, { miter: getElement('miter').value });
});

// CLEAR CANVAS (ALL LAYERS)
getElement('clear').addEventListener('click', function() {
  LAYERS.head.scene.clear();
  LAYERS.text.scene.clear();
  LAYERS.frame.scene.clear();
  LAYERS.fill.scene.clear();
  LAYERS.bg.scene.clear();
  viewport.scene.clear();
});

// Add Donations
getElement('donate').addEventListener('click', function() {
  let index = getElement('donations').children.length;
  let html = `<label for="donor">Donor Name</label>
    <input type="text" name="donor" value="Somebody" onchange="updateDonor(${index})">
    <label for="amt">Amount</label>
    <input type="number" name="amt" min=0.00 step=0.05 value="5.00" onchange="applyDonation(${index})">
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

// =========================
// Restore Canvas
// =========================
if (localStorage.getItem(APPNAME)) {
  // TODO RestoreData from LocalStorage with validity checks
  APPDATA = JSON.parse(localStorage.getItem(APPNAME));
  if (APPDATA.version == VERSION) {
    console.log("restore");
    Object.keys(LAYERS).map(function(key) {
      let img = new Image();
      img.src = APPDATA.layers[key];
      img.onload = function() {
        drawImageOnLayer(LAYERS[key], img, { x: 0, y: 0, w: WIDTH, h: HEIGHT, cropX: 0, cropY: 0, cropW: WIDTH * 2, cropH: HEIGHT * 2 });
      }
    });
  } else {
    console.log("version diff");
    updateGoalTextLayers();
    updateHeadshots();
  }

} else {
  console.log("no data; create new");
  updateGoalTextLayers();
  updateHeadshots();
  //RedrawText();
}