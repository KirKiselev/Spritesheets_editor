let input = document.getElementById("fileInput");
let imageDataArray = [];

function addToMainCanvas() {
  let imageToTransfer = ctxAux.getImageData(0, 0, currentSpriteSheetProperties.totalWidth, currentSpriteSheetProperties.frameHeight);
  imageToTransfer.frameWidth = currentSpriteSheetProperties.frameWidth;
  imageDataArray.push(imageToTransfer);

  redrawMainCanvas();
}

function addSpriteSheetLabel(id, top) {
  let elem = document.createElement("div");
  let container = document.getElementById("spritesheets_labels");

  elem.className = "label";
  elem.appendChild(document.createElement("button"));
  elem.appendChild(document.createElement("button"));
  elem.firstChild.textContent = "Edit";
  elem.firstChild.className = "label_edit";
  elem.firstChild.id = id;
  elem.firstChild.onclick = editImageDataElement;
  elem.lastChild.textContent = "Del";
  elem.lastChild.className = "label_delete";
  elem.lastChild.id = id;
  elem.lastChild.onclick = deleteImageDataArrayElement;
  elem.style.height = top + "px";

  container.append(elem);
}

function deleteImageDataArrayElement(event) {
  imageDataArray = imageDataArray.filter((elem, index) => {
    if (index != event.target.id) {
      return true;
    }
  });
  redrawMainCanvas();
}

function editImageDataElement(event) {
  let elem = event.target.id;
  clearAuxillaryCanvas();
  auxillaryCanvas.width = imageDataArray[elem].width;
  auxillaryCanvas.height = imageDataArray[elem].height;

  ctxAux.putImageData(imageDataArray[elem], 0, 0);

  //
  currentSpriteSheetProperties.frames = imageDataArray[elem].width / imageDataArray[elem].frameWidth;
  currentSpriteSheetProperties.frameWidth = imageDataArray[elem].frameWidth;
  currentSpriteSheetProperties.frameHeight = imageDataArray[elem].height;
  currentSpriteSheetProperties.totalWidth = imageDataArray[elem].width;
  //
}

function saveMainCanvas() {
  return;
}

function loadMainCanvas() {
  return;
}

document.addEventListener("mousedown", (event) => {
  if (event.target.classList.contains("dragable")) {
    event.target.dragCorrection_x = event.pageX - event.target.offsetLeft;
    event.target.dragCorrection_y = event.pageY - event.target.offsetTop;
    event.target.dragInProgress = true;
  }
});

document.addEventListener("mousemove", (event) => {
  if (event.target.classList.contains("dragable") && event.target.dragInProgress === true) {
    event.target.style.top = event.pageY - event.target.dragCorrection_y + "px";
    event.target.style.left = event.pageX - event.target.dragCorrection_x + "px";
  }
});

document.addEventListener("mouseup", (event) => {
  if (event.target.classList.contains("dragable")) {
    event.target.dragInProgress = false;
  }
});
