let reader = []; //  store of files converted to ArrayBuffer

let colorPalette = []; // usually every image have personal 256-colors palette

let rect_size = 1; //  size ratio, default 1 ( 1 pixel of original image to 1 pixel in new image )
let absolutePosition = { x: 0, y: 0 }; //
let currentPosition = { x: 0, y: 0 }; //

function getPalette(UIArr) {
  let tmp = "";
  let R = "";
  let G = "";
  let B = "";

  for (let i = UIArr.length - 768; i < UIArr.length; i += 3) {
    tmp = "#";
    R = UIArr[i].toString(16);
    G = UIArr[i + 1].toString(16);
    B = UIArr[i + 2].toString(16);

    R.length > 1 ? (tmp += R) : (tmp += "0" + R);
    G.length > 1 ? (tmp += G) : (tmp += "0" + G);
    B.length > 1 ? (tmp += B) : (tmp += "0" + B);
    colorPalette.push(tmp);
  }
}

function drawPixel(col) {
  ctxAux.fillStyle = col;
  ctxAux.fillRect(rect_size * currentPosition.x, rect_size * currentPosition.y, rect_size, rect_size);
  currentPosition.x++;
  if (currentPosition.x === absolutePosition.x + currentImageWidth) {
    currentPosition.x = absolutePosition.x;
    currentPosition.y++;
  }
}

//____Flags initialization____

function flagsInitialization(UInt8Elem) {
  let FLAGS = {
    useTransparency: false,
    useVideoMemory: false,
    useSystemMemory: false,
    mirror: false,
    invert: false,
    compression: false,
    lights: false,
    containsPalette: false,
  };

  if (UInt8Elem >= 128) {
    UInt8Elem -= 128;
    FLAGS.containsPalette = true;
  }
  if (UInt8Elem >= 64) {
    UInt8Elem -= 64;
    FLAGS.lights = true;
  }
  if (UInt8Elem >= 32) {
    UInt8Elem -= 32;
    FLAGS.compression = true;
  }
  if (UInt8Elem >= 16) {
    UInt8Elem -= 16;
    FLAGS.invert = true;
  }
  if (UInt8Elem >= 8) {
    UInt8Elem -= 8;
    FLAGS.mirror = true;
  }
  if (UInt8Elem >= 4) {
    UInt8Elem -= 4;
    FLAGS.useSystemMemory = true;
  }
  if (UInt8Elem >= 2) {
    UInt8Elem -= 2;
    FLAGS.useVideoMemory = true;
  }
  if (UInt8Elem == 1) {
    FLAGS.useTransparency = true;
  }
  return FLAGS;
}

function drawImage(UIArr) {
  let flagsData = flagsInitialization(UIArr[4]);
  currentPosition.x = absolutePosition.x;

  let readingPosition = 32;
  let tmpByte;
  let jumpTimes;
  let colorID;
  let numberOfPixels;

  //____use_RLE_compression____
  if (flagsData.compression === true) {
    while (readingPosition < UIArr.length - 768) {
      tmpByte = UIArr[readingPosition];

      if (tmpByte > 128) {
        jumpTimes = tmpByte - 128;
        for (let i = 0; i < jumpTimes; i++) {
          drawPixel("#00000000");
        }
        readingPosition++;
      } else {
        for (let j = 1; j <= tmpByte; j++) {
          colorID = UIArr[readingPosition + j];
          drawPixel(colorPalette[colorID]);
        }
        readingPosition += tmpByte;
        readingPosition++;
      }
    }
  }
  //____use_default_compression____
  else {
    while (readingPosition < UIArr.length - 768) {
      tmpByte = UIArr[readingPosition];

      if (tmpByte > 192) {
        numberOfPixels = tmpByte - 192;
        colorID = UIArr[readingPosition + 1];
        readingPosition++;
      } else {
        numberOfPixels = 1;
        colorID = tmpByte;
      }
      for (let i = 0; i < numberOfPixels; i++) {
        drawPixel(colorPalette[colorID]);
      }
      readingPosition++;
    }
  }
  absolutePosition.x += maxImageWidth;
  currentPosition.y = 0;
}
