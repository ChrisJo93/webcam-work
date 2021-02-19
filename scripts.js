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

getVideo();

video.addEventListener('canplay', paintToCanvas);
//video emits "canplay" triggering painting
