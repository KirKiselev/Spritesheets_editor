let input = document.getElementById("fileInput");
let imageDataArray = [];
let labels = document.getElementById("spritesheets_labels");
let elem = document.createElement("div");
elem.appendChild(document.createElement("button"));
elem.appendChild(document.createElement("button"));
elem.firstChild.textContent = "Edit";
elem.firstChild.style.backgroundcolor = "green";
elem.lastChild.textContent = "Del";
elem.lastChild.style.backgroundcolor = "Red";

function addToMainCanvas() {
  let imageToTransfer = ctxAux.getImageData(0, 0, currentSpriteSheetProperties.totalWidth, currentSpriteSheetProperties.frameHeight);
  imageDataArray.push(imageToTransfer);
  mainCanvasCurrentSize.height += imageToTransfer.height;
  if (mainCanvasCurrentSize.width < imageToTransfer.width) {
    mainCanvasCurrentSize.width = imageToTransfer.width;
  }

  setMainCanvasSize();
  redrawMainCanvas();
  addSpriteSheetLabel();
}

function addSpriteSheetLabel() {
  let elem = document.createElement("div");
  let container = document.getElementById("spritesheets_labels");

  elem.className = "label";
  elem.appendChild(document.createElement("button"));
  elem.appendChild(document.createElement("button"));
  elem.firstChild.textContent = "Edit";
  elem.lastChild.textContent = "Del";

  container.append(elem);
}
