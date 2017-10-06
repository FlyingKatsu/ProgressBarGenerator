var layerTest;

document.addEventListener('DOMContentLoaded', function() {

  // shorthand GetElementById
  function getElement(id) { return document.getElementById(id) }

  // NOTE: output image is double these dimensions
  WIDTH = 480;
  HEIGHT = 560;
  HEADSIZE = 48;
  PAD_RIGHT = 84;
  PAD_LEFT = 64;
  PAD_TOP = 64;
  PAD_BOTTOM = 64;

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
        font: "sans-serif",
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
          font: "sans-serif",
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
          font: "sans-serif",
          x: 0,
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
        font: "sans-serif",
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

  // Layers: bg, progress frame, progress fill, text
  var bgLayer = new Concrete.Layer();
  var frameLayer = new Concrete.Layer();
  var fillLayer = new Concrete.Layer();
  var textLayer = new Concrete.Layer();

  viewport.add(bgLayer)
    .add(frameLayer)
    .add(fillLayer)
    .add(textLayer);

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
    ctx.textAlign = options.align || "left";
    ctx.textBaseline = options.baseline || "hanging";
    ctx.fillText(text, options.x, options.y);
    ctx.strokeText(text, options.x, options.y);
    ctx.restore();
    viewport.render();
  }

  // Test Fonts
  function testFonts(txt, font) {
    txt.split("\\n").map(
      function(subtxt, i) {
        drawTextOnLayer(textLayer, subtxt, {
          thick: 2,
          stroke: "#000",
          fill: "#fff",
          font: font,
          align: "left",
          x: 16,
          y: 32 + 64 * i
        });
      }
    );
  }

  // Preload fonts into cache for quicker display
  testFonts('//ABCDEFGHIJK\nLMNOPQRSTUVWXYZ\n!@#$%^*()[]', '32px sans-serif');
  testFonts('//ABCDEFGHIJK\nLMNOPQRSTUVWXYZ\n!@#$%^*()[]', '32px Exo Black Italic');
  testFonts('//ABCDEFGHIJK\nLMNOPQRSTUVWXYZ\n!@#$%^*()[]', '32px Kanit Black Italic');
  testFonts('//ABCDEFGHIJK\nLMNOPQRSTUVWXYZ\n!@#$%^*()[]', '32px Open Sans Extra Bold Italic');
  textLayer.scene.clear();

  // =========================
  // Restore Canvas
  // =========================
  // TODO: storage by layers
  if (localStorage.getItem('imageDataURL')) {
    var img = new Image();
    img.src = localStorage.getItem('imageDataURL');
    img.onload = function() {
      drawImageOnLayer(bgLayer, img, { x: 0, y: 0, w: WIDTH, h: HEIGHT, cropX: 0, cropY: 0, cropW: WIDTH * 2, cropH: HEIGHT * 2 });
    }
  }

  // Layer Redraws

  function RedrawText() {
    textLayer.scene.clear();

    // Draw the titles
    INPUT.Title.Data.map(function(title, i) {
      drawTextOnLayer(textLayer, title.name, {
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
      drawTextOnLayer(textLayer, goal.name, {
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
      drawTextOnLayer(textLayer, `${goal.progress.a}/${goal.progress.b}`, {
        thick: INPUT.Goal.Font.Progress.stroke,
        stroke: INPUT.Goal.Font.Progress.line,
        fill: INPUT.Goal.Font.Progress.fill,
        fontsize: INPUT.Goal.Font.Progress.size,
        fontfamily: INPUT.Goal.Font.Progress.font,
        align: INPUT.Goal.Font.Progress.align,
        baseline: INPUT.Goal.Font.Progress.baseline,
        x: INPUT.Goal.Style.Position.x + INPUT.Goal.Font.Progress.x,
        y: INPUT.Goal.Style.Position.y + INPUT.Goal.Font.Progress.y + (INPUT.Goal.Font.Name.size + INPUT.Goal.Style.Space.y) * i
      });
    });

    // Draw the list items
    INPUT.Item.Data.map(function(item, i) {
      drawTextOnLayer(textLayer, item, {
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

  RedrawText();

  // =========================
  // Button Controls
  // =========================

  function updateImageInput(id, img) {
    getElement(id + '-preview').innerHTML = `<img src="${img.src}">`;
    getElement(id + '-W').value = img.naturalWidth;
    getElement(id + '-H').value = img.naturalHeight;
    getElement(id + '-cropX').value = 0;
    getElement(id + '-cropY').value = 0;
    getElement(id + '-cropW').value = img.naturalWidth;
    getElement(id + '-cropH').value = img.naturalHeight;
  }

  // Draw uploaded image
  function drawImageTo(id, options) {
    return function() {
      if (this.files && this.files[0]) {
        var FR = new FileReader();
        FR.onload = function(e) {
          var img = new Image();
          img.addEventListener("load", function() {
            updateImageInput(id, img);
            drawImageOnLayer(fillLayer, img, options);
          });
          img.src = e.target.result;
        };
        FR.readAsDataURL(this.files[0]);
      }
    }
  }
  getElement('upload-1').addEventListener("change", drawImageTo('upload-1', {
    x: WIDTH - PAD_RIGHT,
    y: PAD_TOP,
    w: HEADSIZE,
    h: HEADSIZE,
    cropX: 0,
    cropY: 0,
    cropW: HEADSIZE,
    cropH: HEADSIZE
  }), false);

  getElement('upload-2').addEventListener("change", drawImageTo('upload-2', {
    x: WIDTH - PAD_RIGHT,
    y: PAD_TOP + HEADSIZE * 2 + HEADSIZE / 2,
    w: HEADSIZE,
    h: HEADSIZE,
    cropX: 0,
    cropY: 0,
    cropW: HEADSIZE,
    cropH: HEADSIZE
  }), false);

  getElement('upload-3').addEventListener("change", drawImageTo('upload-3', {
    x: WIDTH - PAD_RIGHT,
    y: PAD_TOP + HEADSIZE * 4 + HEADSIZE / 2 * 2,
    w: HEADSIZE,
    h: HEADSIZE,
    cropX: 0,
    cropY: 0,
    cropW: HEADSIZE,
    cropH: HEADSIZE
  }), false);

  getElement('upload-4').addEventListener("change", drawImageTo('upload-4', {
    x: WIDTH - PAD_RIGHT,
    y: PAD_TOP + HEADSIZE * 6 + HEADSIZE / 2 * 3,
    w: HEADSIZE,
    h: HEADSIZE,
    cropX: 0,
    cropY: 0,
    cropW: HEADSIZE,
    cropH: HEADSIZE
  }), false);

  // Update Title Text
  getElement('title').addEventListener('change', function() {
    drawTextOnLayer(textLayer, getElement('title').value, {
      thick: 2,
      stroke: "#000",
      fill: "#fff",
      font: "48px Changa One",
      x: 16,
      y: 0
    });
  });

  getElement('goal-1').addEventListener('change', function() {
    drawOnLayer(frameLayer, {
      x: 0,
      y: PAD_TOP + 6,
      w: 4 * WIDTH / 5,
      h: HEADSIZE - 8,
      color: "#000",
      percent: 1
    });
    drawOnLayer(fillLayer, {
      x: 0,
      y: PAD_TOP + 10,
      w: 4 * WIDTH / 5 - 4,
      h: HEADSIZE - 16,
      color: "#ff0000",
      percent: getElement('goal-1-A').value / getElement('goal-1-B').value
    });
    drawTextOnLayer(textLayer, getElement('goal-1').value, {
      thick: 2,
      stroke: "#000",
      fill: "#fff",
      font: "32px Changa One",
      x: 16,
      y: PAD_TOP + 12
    });
    drawTextOnLayer(textLayer, `${getElement('goal-1-A').value}/${getElement('goal-1-B').value}`, {
      thick: 2,
      stroke: "#000",
      fill: "#fff",
      font: "32px Changa One",
      align: "right",
      x: 4 * WIDTH / 5,
      y: PAD_TOP + 40 + 12
    });
  });

  getElement('goal-2').addEventListener('change', function() {
    drawOnLayer(frameLayer, {
      x: 0,
      y: PAD_TOP + HEADSIZE * 2 + 30,
      w: 4 * WIDTH / 5,
      h: HEADSIZE - 8,
      color: "#000",
      percent: 1
    });
    drawOnLayer(fillLayer, {
      x: 0,
      y: PAD_TOP + HEADSIZE * 2 + 34,
      w: 4 * WIDTH / 5 - 4,
      h: HEADSIZE - 16,
      color: "#ff0000",
      percent: getElement('goal-2-A').value / getElement('goal-2-B').value
    });
    drawTextOnLayer(textLayer, getElement('goal-2').value, {
      thick: 2,
      stroke: "#000",
      fill: "#fff",
      font: "32px Changa One",
      x: 16,
      y: PAD_TOP + HEADSIZE * 2 + 30 + 6
    });
    drawTextOnLayer(textLayer, `${getElement('goal-2-A').value}/${getElement('goal-2-B').value}`, {
      thick: 2,
      stroke: "#000",
      fill: "#fff",
      font: "32px Changa One",
      align: "right",
      x: 4 * WIDTH / 5,
      y: PAD_TOP + HEADSIZE * 2 + 30 + 48
    });
  });

  // Download using input filename
  getElement('download').addEventListener('click', function() {
    // Save in storage
    localStorage.setItem('imageDataURL', viewport.scene.canvas.toDataURL());
    localStorage.setItem('settings', 'TODO');
    // Download file
    viewport.scene.download({
      fileName: getElement('filename').value || 'genTipJarProgress.png'
    });
  });

  getElement('font-size').addEventListener('change', function() {
    textLayer.scene.clear();
    testFonts(getElement('font-sample').value, getElement('font-size').value + 'px ' + getElement('font-family').value);
  });

  getElement('font-sample').addEventListener('change', function() {
    textLayer.scene.clear();
    testFonts(getElement('font-sample').value, getElement('font-size').value + 'px ' + getElement('font-family').value);
  });

  getElement('font-family').addEventListener('change', function() {
    getElement('font-family').style = `font-family: '${getElement('font-family').value}';`;
    textLayer.scene.clear();
    testFonts(getElement('font-sample').value, getElement('font-size').value + 'px ' + getElement('font-family').value);
  });

  // CLEAR CANVAS (ALL LAYERS)
  getElement('clear').addEventListener('click', function() {
    textLayer.scene.clear();
    frameLayer.scene.clear();
    fillLayer.scene.clear();
    bgLayer.scene.clear();
    viewport.scene.clear();
  })

});