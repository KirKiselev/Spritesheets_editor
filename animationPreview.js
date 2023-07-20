let timer = null;
let animationCounter = 0;
let animationCanvas = document.getElementById("animation_canvas");
let ctxAnimation = animationCanvas.getContext("2d");
let frameNumber;
let timeBetweenFrames = 80;

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
