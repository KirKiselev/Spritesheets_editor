let timer = null;
let animationCounter = 0;
let animationCanvas = document.getElementById("animation_canvas");
let ctxAnimation = animationCanvas.getContext("2d");
let frameNumber;
let timeBetweenFrames = 80;

let animationPreview = document.getElementById("animation_preview");
animationPreview.dragCorrection = { x: 0, y: 0 };
animationPreview.dragInProgress = false;

animationPreview.onmousedown = function (event) {
  if (event.target === animationPreview) {
    animationPreview.dragCorrection.x = event.pageX - animationPreview.offsetLeft;
    animationPreview.dragCorrection.y = event.pageY - animationPreview.offsetTop;
    animationPreview.dragInProgress = true;
  }
};

animationPreview.onmousemove = function (event) {
  if (animationPreview.dragInProgress === true) {
    animationPreview.style.top = event.pageY - animationPreview.dragCorrection.y + "px";
    animationPreview.style.left = event.pageX - animationPreview.dragCorrection.x + "px";
  }
};

animationPreview.onmouseup = function (event) {
  animationPreview.dragInProgress = false;
};

function startAnimation() {
  if (currentSpriteSheetProperties.frames != undefined) {
    drawAnimation();
  }
}

function stopAnimation() {
  if (timer != null) {
    clearTimeout(timer);
    ctxAnimation.clearRect(0, 0, 128, 128);
  }
}

function drawAnimation() {
  ctxAnimation.clearRect(0, 0, 128, 128);
  frameNumber = animationCounter % currentSpriteSheetProperties.frames;
  let spriteSheet = ctxAux.getImageData(currentSpriteSheetProperties.frameWidth * frameNumber, 0, currentSpriteSheetProperties.frameWidth, currentSpriteSheetProperties.frameHeight);
  ctxAnimation.putImageData(spriteSheet, 0, 0);
  animationCounter++;
  timer = setTimeout(drawAnimation, timeBetweenFrames);
}

function setTimeBetweenFrames() {
  let input = document.getElementById("time_between_frames");
  timeBetweenFrames = input.value;
}
