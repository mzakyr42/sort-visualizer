const MIN_MERGE = 32;

let freq_min = 120;
let freq_max = 1200;

function calculate_freq(i) {
  return i / array.length * (freq_max - freq_min) + freq_min;
}

function play_sound(freq) {
  if (audio_ctx == null) {
    audio_ctx = new (
      AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext
    )();
  }
  const oscillator = audio_ctx.createOscillator();
  oscillator.type = "triangle";
  oscillator.frequency.value=freq;
  const node = audio_ctx.createGain();
  node.gain.value = 0.03;
  node.gain.linearRampToValueAtTime(
    0, audio_ctx.currentTime + 0.1
  );
  oscillator.connect(node).connect(audio_ctx.destination);
  oscillator.start();
  oscillator.stop(audio_ctx.currentTime + 0.1);
  // node.connect(audio_ctx.destination);

  // setTimeout(function() {
        // oscillator.stop();
  // }, 50);
}

function random_number(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
      async function sleep(ms) {
        if (ms > 10) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        } else {
          return new Promise((resolve) => {
            const start = performance.now();

            const channel = new MessageChannel();
            const port = channel.port2;
            channel.port1.onmessage = () => {
              const now = performance.now();
              if (now - start >= ms) {
                resolve();
              } else {
                port.postMessage(null);
              }
            };

            port.postMessage(null);
          });
        }
      }
function initialize() {
  // let n = values - 1;
  // let c = 2 * Math.PI / n;
  let mid = (values - 1) / 2;
  for (var i = 0; i < values; i++) {
    // array[i] = random_number(min_index, max_index);
    // array[i] = Math.round((i+1) / 10) * 10;
    // array[i] = parseInt(Math.pow(i+1, 2) / values);
    // array[i] = parseInt(n * Math.sin(c * i)+1) / 2;
    // array[i] = parseInt((Math.pow(i-mid, 5) / Math.pow(mid, 4)) + mid;
    array[i] = i+1;
  }
}

function render_values(array) {
  value_container.innerHTML = "";
  if (visualization == 1 || visualization == 2 || visualization == 3) { value_container.style.alignItems = "flex-start"; }
  else if (visualization == 4 || visualization == 5) { value_container.style.alignItems = "center"; } 
  for (var i = 0; i < array.length; i++) {
    var value = document.createElement("div");
    value.classList.add("value");
    // if (visualization == 1) { value.style.height = array[i] * size_factor + "px"; }
    // else if (visualization == 2) { value.style.marginTop = array[i] * size_factor + "px"; }
    // else if (visualization == 3) { 
    //   value.style.height = array[i] * size_factor + "px";
    //   value.style.backgroundColor = `hsl(${array[i]}, 100%, 50%)`;
    // } else if (visualization == 4) {
    //   value_container.style.alignItems = "center";
    //   value.style.height = array[i] * size_factor + "px";
    // } else if (visualization == 5) {
    //   value_container.style.alignItems = "center";
    //   value.style.height = array[i] * size_factor + "px";
    //   value.style.backgroundColor = `hsl(${array[i]}, 100%, 50%)`;
    // }
    switch (visualization) {
      case 1: case 4: value.style.height = array[i] * size_factor + "px"; break;
      case 2: value.style.marginTop = array[i] * size_factor + "px"; break;
      case 3: case 5:
        value.style.height = array[i] * size_factor + "px";
        value.style.backgroundColor = `hsl(${array[i]}, 100%, 50%)`;
        break;
      default: console.log("hmmm"); break;
    }
    value_container.appendChild(value);
  }
  // value_container.style.transform = "rotate(180deg)";
}

async function randomize_array(array, speed) {
  var current_index = array.length, random_index;

  while (current_index > 0) {
    random_index = random_number(0, array.length - 1);
    current_index--;

    await swap_value(array, current_index, random_index);
    await swap(array, current_index, random_index);
    await sleep(speed);
  }
}

function swap(array, i, j) {
  var temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

async function swap_value(array, i, j) {
  var values = document.getElementsByClassName("value");
  switch (visualization) {
    case 1: case 4:
      values[i].style.height = array[j] * size_factor + "px";
      values[i].style.backgroundColor = "red";
      values[j].style.height = array[i] * size_factor + "px";
      values[j].style.backgroundColor = "blue";
      break;
    case 2:
      values[i].style.marginTop = array[j] * size_factor + "px";
      values[i].style.backgroundColor = "red";
      values[j].style.marginTop = array[i] * size_factor + "px";
      values[j].style.backgroundColor = "blue";
      break;
    case 3: case 5:
      values[i].style.height = array[j] * size_factor + "px";
      values[i].style.backgroundColor = "white";
      values[j].style.height = array[i] * size_factor + "px";
      values[j].style.backgroundColor = "white";
      break;
    default:
      break;
  }
  for (var k = 0; k < values.length; k++) {
    if (k !== i && k !== j) {
      if (visualization == 1 || visualization == 2 || visualization == 4) { 
        values[k].style.backgroundColor = "white";
      } if (visualization == 3 || visualization == 5) {
        values[k].style.height = array[k] * size_factor + "px";
        values[k].style.backgroundColor = `hsl(${array[k]}, 100%, 50%)`;
      }

      // values[k].style.backgroundColor = `hsl(${array[k]}, 100%, 50%)`;
    }
  }

  await play_sound(calculate_freq(array[i]));
  await play_sound(calculate_freq(array[j]));
}

async function change_value_color(array, i, color) {
  var values = document.getElementsByClassName("value");
  if (visualization == 1 || visualization == 2) values[i].style.backgroundColor = color;
  else if (visualization == 3) {
    if (color != "white") {
      values[i].style.backgroundColor = "white";
    } else if (color == "white") {
      values[i].style.backgroundColor = `hsl(${array[i]}, 100%, 50%)`;
    }
  }
  switch (visualization) {
    case 1: case 2: case 4:
      values[i].style.backgroundColor = color;
      break;
    case 3: case 5:
      if (color != "white") {
        values[i].style.backgroundColor = "white";
      } else if (color == "white") {
        values[i].style.backgroundColor = `hsl(${array[i]}, 100%, 50%)`;
      }
      break;
    default:
      break;
  }
  if (color != "white") {
    await play_sound(calculate_freq(array[i]));
  }
}

function change_value_height(i, height) {
  var values = document.getElementsByClassName("value");
  // if (visualization == 1) { values[i].style.height = height * size_factor + "px"; }
  // else if (visualization == 2) { values[i].style.marginTop = height * size_factor + "px"; } 
  // else if (visualization == 3) {
  //   values[i].style.height = height * size_factor + "px";
  //   values[i].style.backgroundColor = `hsl(${height}, 100%, 50%)`;
  // }
  switch (visualization) {
    case 1: case 4: values[i].style.height = height * size_factor + "px"; break;
    case 2: values[i].style.marginTop = height * size_factor + "px"; break;
    case 3: case 5:
      values[i].style.height = height * size_factor + "px";
      values[i].style.backgroundColor = `hsl(${height}, 100%, 50%)`;
      break;
    default: break;
  }
}
