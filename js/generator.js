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
    ctx.font = options.font;
    ctx.textAlign = options.align || "left";
    ctx.fillText(text, options.x, options.y);
    ctx.strokeText(text, options.x, options.y);
    ctx.restore();
    viewport.render();
  }


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
      y: PAD_TOP / 2
    });
    textLayer.scene.clear();
    drawTextOnLayer(textLayer, getElement('title').value, {
      thick: 2,
      stroke: "#000",
      fill: "#fff",
      font: "48px Changa One",
      x: 16,
      y: PAD_TOP / 2
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
    drawOnLayer(frameLayer, {
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
      y: PAD_TOP + 34
    });
    drawTextOnLayer(textLayer, `${getElement('goal-1-A').value}/${getElement('goal-1-B').value}`, {
      thick: 2,
      stroke: "#000",
      fill: "#fff",
      font: "32px Changa One",
      align: "right",
      x: 4 * WIDTH / 5,
      y: PAD_TOP + 34 + 36
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
    drawOnLayer(frameLayer, {
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
      y: PAD_TOP + HEADSIZE * 2 + 58
    });
    drawTextOnLayer(textLayer, `${getElement('goal-2-A').value}/${getElement('goal-2-B').value}`, {
      thick: 2,
      stroke: "#000",
      fill: "#fff",
      font: "32px Changa One",
      align: "right",
      x: 4 * WIDTH / 5,
      y: PAD_TOP + HEADSIZE * 2 + 58 + 36
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

});