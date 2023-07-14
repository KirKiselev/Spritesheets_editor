let auxillaryCanvas = document.getElementById("auxillary_canvas");
let ctxAux = auxillaryCanvas.getContext("2d");
auxillaryCanvas.addEventListener("click", (e) => {
  setFrameToEdit(e);
});
let frameEditor = document.getElementById("frame_editor");
let frameEditor_frameNumber = 0;

let array = []; //  store of Buffers converted to UInt8 arrays
let maxImageWidth = 0; // maximum width and height of loaded images
let maxImageHeight = 0;

let currentImageWidth = 0;
let currentSpriteSheetProperties = {};

function toArrayBuffer() {
  let tmp;
  for (let elem of input.files) {
    tmp = new FileReader();
    tmp.readAsArrayBuffer(elem);
    reader.push(tmp);
  }
}

function toTypedArray() {
  for (let elem of reader) {
    array.push(new Uint8Array(elem.result));
  }
}

function setCanvasSize() {
  for (let elem of array) {
    if (elem[8] > maxImageWidth) {
      maxImageWidth = elem[8];
    }
    if (elem[12] > maxImageHeight) {
      maxImageHeight = elem[12];
    }
  }

  auxillaryCanvas.width = maxImageWidth * rect_size * array.length;
  auxillaryCanvas.height = maxImageHeight * rect_size;
}

function convert() {
  toTypedArray();
  setCanvasSize();

  for (let elem of array) {
    currentImageWidth = elem[8];
    colorPalette.length = 0;
    getPalette(elem);
    drawImage(elem);
  }
  currentSpriteSheetProperties = {
    frames: array.length,
    frameWidth: maxImageWidth * rect_size,
    frameHeight: maxImageHeight * rect_size,
    totalWidth: maxImageWidth * rect_size * array.length,
  };
}

function clearAuxillaryCanvas() {
  ctxAux.clearRect(0, 0, currentSpriteSheetProperties.totalWidth, currentSpriteSheetProperties.frameHeight);
  input.value = null;
  reader.length = 0;
  array.length = 0;
  currentPosition = { x: 0, y: 0 };
  absolutePosition = { x: 0, y: 0 };
  currentSpriteSheetProperties = {};
}

function setFrameToEdit(e) {
  if (currentSpriteSheetProperties.frames != undefined) {
    frameEditor_frameNumber = Math.floor(e.offsetX / currentSpriteSheetProperties.frameWidth);
    frameEditor.style.left = currentSpriteSheetProperties.frameWidth * frameEditor_frameNumber + "px";
    frameEditor.style.visibility = "visible";
  }
}

function closeFrameEditor() {
  frameEditor.style.visibility = "collapse";
}

function shiftFrameUp() {
  let frameData = ctxAux.getImageData(currentSpriteSheetProperties.frameWidth * frameEditor_frameNumber, 0, currentSpriteSheetProperties.frameWidth, currentSpriteSheetProperties.frameHeight);
  let end = frameData.data.length - frameData.width * 4;

  for (let i = 0; i < end; i++) {
    frameData.data[i] = frameData.data[i + frameData.width * 4];
  }
  for (let j = end; j < frameData.data.length; j++) {
    frameData.data[j] = frameData.data[j + frameData.width * 4];
  }

  ctxAux.putImageData(frameData, currentSpriteSheetProperties.frameWidth * frameEditor_frameNumber, 0);
}

function shiftFrameRight() {
  let frameData = ctxAux.getImageData(currentSpriteSheetProperties.frameWidth * frameEditor_frameNumber, 0, currentSpriteSheetProperties.frameWidth, currentSpriteSheetProperties.frameHeight);

  for (let i = frameData.data.length - 1; i > 3; i--) {
    frameData.data[i] = frameData.data[i - 4];
  }
  frameData.data[0] = 0;
  frameData.data[1] = 0;
  frameData.data[2] = 0;
  frameData.data[3] = 0;

  ctxAux.putImageData(frameData, currentSpriteSheetProperties.frameWidth * frameEditor_frameNumber, 0);
}

function shiftFrameDown() {
  let frameData = ctxAux.getImageData(currentSpriteSheetProperties.frameWidth * frameEditor_frameNumber, 0, currentSpriteSheetProperties.frameWidth, currentSpriteSheetProperties.frameHeight);
  let end = frameData.width * 4;
  for (let i = frameData.data.length - 1; i >= end; i--) {
    frameData.data[i] = frameData.data[i - end];
  }
  for (let j = end - 1; j >= 0; j--) {
    frameData.data[j] = 0;
  }
  ctxAux.putImageData(frameData, currentSpriteSheetProperties.frameWidth * frameEditor_frameNumber, 0);
}

function shiftFrameLeft() {
  let frameData = ctxAux.getImageData(currentSpriteSheetProperties.frameWidth * frameEditor_frameNumber, 0, currentSpriteSheetProperties.frameWidth, currentSpriteSheetProperties.frameHeight);
  let end = frameData.data.length - 4;

  for (let i = 0; i < end; i++) {
    frameData.data[i] = frameData.data[i + 4];
  }
  frameData.data[end - 4] = 0;
  frameData.data[end - 3] = 0;
  frameData.data[end - 2] = 0;
  frameData.data[end - 1] = 0;

  ctxAux.putImageData(frameData, currentSpriteSheetProperties.frameWidth * frameEditor_frameNumber, 0);
}
