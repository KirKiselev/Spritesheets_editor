let mainCanvas = document.getElementById("main_canvas");
let ctxMain = mainCanvas.getContext("2d");

let mainCanvasCurrentSize = { width: 0, height: 0 };

function setMainCanvasSize() {
  mainCanvas.width = mainCanvasCurrentSize.width;
  mainCanvas.height = mainCanvasCurrentSize.height;
}

function redrawMainCanvas() {
  let currentY = 0;

  for (let elem of imageDataArray) {
    ctxMain.putImageData(elem, 0, currentY);
    currentY += elem.height;
  }
}

/*let canvasURL = canvas.toDataURL();
  let link = document.createElement("a");
  link.download = "download";
  link.href = canvasURL;
  document.body.append(link);
  link.click();*/
