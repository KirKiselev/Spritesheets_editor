let mainCanvas = document.getElementById("main_canvas");
let ctxMain = mainCanvas.getContext("2d");

let mainCanvasCurrentSize = { width: 0, height: 0 };

function setMainCanvasSize() {
  mainCanvasCurrentSize.width = 0;
  mainCanvasCurrentSize.height = 0;

  for (elem of imageDataArray) {
    if (elem.width > mainCanvasCurrentSize.width) {
      mainCanvasCurrentSize.width = elem.width;
    }
    mainCanvasCurrentSize.height += elem.height;
  }

  mainCanvas.width = mainCanvasCurrentSize.width;
  mainCanvas.height = mainCanvasCurrentSize.height;
}

function redrawMainCanvas() {
  let currentY = 0;
  let spritesheets_labels = document.getElementById("spritesheets_labels");
  spritesheets_labels.remove();

  let new_spritesheets_labels = document.createElement("div");
  new_spritesheets_labels.id = "spritesheets_labels";
  let container = document.getElementById("main_canvas_wrapper");
  container.appendChild(new_spritesheets_labels);

  setMainCanvasSize();
  ctxMain.clearRect(0, 0, mainCanvasCurrentSize.width, mainCanvasCurrentSize.height);

  imageDataArray.map((elem, i) => {
    ctxMain.putImageData(elem, 0, currentY);
    addSpriteSheetLabel(i, elem.height);
    currentY += elem.height;
  });
}

/*let canvasURL = canvas.toDataURL();
  let link = document.createElement("a");
  link.download = "download";
  link.href = canvasURL;
  document.body.append(link);
  link.click();*/
