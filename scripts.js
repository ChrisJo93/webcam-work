const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);
      //using srcObject property in lieu of createObjectURL
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error('Rip', err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    //Five arguments.
    //1. image to draw.
    //2-3. Start at top left of canvas
    //4-5. Draw to the width and the height
    ctx.drawImage(video, 0, 0, width, height);
    //remove pixels, edit them
    let pixels = ctx.getImageData(0, 0, width, height);

    //replace pixels
    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.2;
    pixels = greenScreen(pixels);

    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('images/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  strip.insertBefore(link, strip.firstChild);
  console.log(data);
}

function redEffect(pixels) {
  //for each image there are 4 entries into a special large number array.
  //the sequence goes red, green, blue, alpha and then repeats.
  //looping over all the pixels at an increment of 4 grabs this sequence.
  //Knowing this, we can target red by grabbing i at 0, green at 1, and blue at 2
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //red
    pixels.data[i + 1] = pixels.data[i + 1] - 60; //green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 550] = pixels.data[i + 0] + 100; //red
    pixels.data[i + 300] = pixels.data[i + 1] - 60; //green
    pixels.data[i - 350] = pixels.data[i + 2] * 0.5; //blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
//video emits "canplay" triggering painting
