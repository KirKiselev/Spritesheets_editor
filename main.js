let input = document.getElementById("fileInput");
let imageDataArray = [];

function addToMainCanvas() {
  let imageToTransfer = ctxAux.getImageData(0, 0, currentSpriteSheetProperties.totalWidth, currentSpriteSheetProperties.frameHeight);
  imageToTransfer.frameWidth = currentSpriteSheetProperties.frameWidth;
  imageToTransfer.animationName = getAnimationName();
  imageDataArray.push(imageToTransfer);

  redrawMainCanvas();
}

function getAnimationName() {
  let character = document.getElementById("animation_name_character");
  let type = document.getElementById("animation_name_type");
  let direction = document.getElementById("animation_name_direction");
  let animationName = character.value + "_" + type.value + "_" + direction.value;

  return animationName;
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
  auxillarySubcanvas.width = imageDataArray[elem].width;
  auxillarySubcanvas.height = imageDataArray[elem].height;

  ctxAux.putImageData(imageDataArray[elem], 0, 0);

  //
  currentSpriteSheetProperties.frames = imageDataArray[elem].width / imageDataArray[elem].frameWidth;
  currentSpriteSheetProperties.frameWidth = imageDataArray[elem].frameWidth;
  currentSpriteSheetProperties.frameHeight = imageDataArray[elem].height;
  currentSpriteSheetProperties.totalWidth = imageDataArray[elem].width;
  //
}

function saveMainCanvas() {
  let coords = [];
  let currentY = 0;

  for (let i = 0; i < imageDataArray.length; i++) {
    let elem = {};
    elem.start_x = 0;
    elem.start_y = 0 || currentY;
    elem.width = imageDataArray[i].width;
    elem.height = imageDataArray[i].height;
    elem.frameWidth = imageDataArray[i].frameWidth;
    elem.animationName = imageDataArray[i].animationName;
    coords.push(elem);
    currentY += imageDataArray[i].height;
  }

  let json = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(coords));
  let link = document.createElement("a");
  link.setAttribute("download", "coords.txt");
  link.href = json;
  document.body.append(link);
  link.click();

  let canvasURL = mainCanvas.toDataURL();
  link.setAttribute("download", "spritesheet.png");
  link.href = canvasURL;
  link.click();
  link.remove();
}

function loadMainCanvas() {
  let spriteSheetInput = document.getElementById("spriteSheetInput");
  let coordinatesInput = document.getElementById("coordinatesInput");

  if (spriteSheetInput.files[0] && coordinatesInput.files[0]) {
    let imgReader = new FileReader();
    imgReader.onloadend = function () {
      let img = new Image();
      img.onload = function () {
        mainCanvas.width = img.width;
        mainCanvas.height = img.height;
        ctxMain.clearRect(0, 0, img.width, img.height);
        ctxMain.drawImage(img, 0, 0);

        let coordReader = new FileReader();
        coordReader.onloadend = function () {
          let coords = JSON.parse(coordReader.result);
          for (let elem of coords) {
            let imageToTransfer = ctxMain.getImageData(elem.start_x, elem.start_y, elem.width, elem.height);
            imageToTransfer.frameWidth = elem.frameWidth;
            imageToTransfer.animationName = elem.animationName;
            imageDataArray.push(imageToTransfer);
          }
          redrawMainCanvas();
        };

        coordReader.readAsText(coordinatesInput.files[0]);
      };
      img.src = imgReader.result;
    };

    imgReader.readAsDataURL(spriteSheetInput.files[0]);
  }
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
