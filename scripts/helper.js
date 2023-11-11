function play_sound(freq) {
  if (audio_ctx == null) {
    audio_ctx = new (
      AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext
    )();
  }
  const duration = 0.1;
  const oscillator = audio_ctx.createOscillator();
  oscillator.frequency.value=freq;
  oscillator.start();
  oscillator.stop(audio_ctx.currentTime + duration);
  const node = audio_ctx.createGain();
  node.gain.value = sound_time;
  node.gain.linearRampToValueAtTime(
    0, audio_ctx.currentTime + duration
  );
  oscillator.connect(node);
  node.connect(audio_ctx.destination);
}

function random_number(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function initialize() {
  for (let i = 0; i < bars; i++) {
    array[i] = random_number(min_index, max_index);
  }
}

function render_bars(array) {
  bar_container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    let bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = array[i] * 3.8 + "px";
    bar_container.appendChild(bar);
  }
  // bar_container.style.transform = "rotate(180deg)";
}

async function randomize_array(array, speed) {
  let current_index = array.length, random_index;

  while (current_index > 0) {
    random_index = random_number(0, array.length - 1);
    current_index--;

    await swap_bar(array, current_index, random_index);
    await swap(array, current_index, random_index);
    await sleep(speed);
  }
}

function swap(array, i, j) {
  let temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

function swap_bar(array, i, j) {
  let bars = document.getElementsByClassName("bar");
  bars[i].style.height = array[j] * 3.8 + "px";
  bars[i].style.backgroundColor = "red";
  bars[j].style.height = array[i] * 3.8 + "px";
  bars[j].style.backgroundColor = "blue";
  for (let k = 0; k < bars.length; k++) {
    if (k !== i && k !== j) {
      bars[k].style.backgroundColor = "white";
    }
  }
  play_sound(array[i] * sound_multiplier);
  play_sound(array[j] * sound_multiplier);
}

function change_bar_color(array, i, color, playsound) {
  let bars = document.getElementsByClassName("bar");
  bars[i].style.backgroundColor = color;
  if (playsound) play_sound(array[i] * sound_multiplier);
}

function change_bar_height(i, height) {
  let bars = document.getElementsByClassName("bar");
  bars[i].style.height = height * 3.8 + "px";
}

async function partition(array, low, high, speed) {
  let pivot = array[high];

  let i = low - 1;

  for (let j = low; j <= high - 1; j++) {
    if (array[j] < pivot) {
      i++;
      await swap_bar(array, i, j);
      await swap(array, i, j);
      await sleep(speed);
    }
  }

  await swap_bar(array, i + 1, high);
  await swap(array, i + 1, high);
  await sleep(speed);
  return i + 1;
}

async function merge(array, left, mid, right, speed) {
  var n1 = mid - left + 1;
  var n2 = right - mid;

  var L = new Array(n1);
  var R = new Array(n2);

  for (var i = 0; i < n1; i++)
    L[i] = array[left + i];
  for (var j = 0; j < n2; j++)
    R[j] = array[mid + 1 + j];

  var i = 0;
  var j = 0;
  var k = left;

  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      await change_bar_height(k, L[i]);
      await change_bar_color(array, k, "red", true);
      array[k] = L[i];
      i++;
      await sleep(speed);
      await change_bar_color(array, k, "white", false);
    } else {
      await change_bar_height(k, R[j]);
      await change_bar_color(array, k, "blue", true);
      array[k] = R[j];
      j++;
      await sleep(speed);
      await change_bar_color(array, k, "white", false);
    }
    k++;
  }

  while (i < n1) {
    await change_bar_height(k, L[i]);
    await change_bar_color(array, k, "red", true);
    array[k] = L[i];
    i++;
    await sleep(speed);
    await change_bar_color(array, k, "white", false);
    k++;
  }

  while (j < n2) {
    await change_bar_height(k, R[j]);
    await change_bar_color(array, k, "blue", true);
    array[k] = R[j];
    j++;
    await sleep(speed);
    await change_bar_color(array, k, "white", false);
    k++;
  }
}

async function heapify(array, N, i, speed) {
  var largest = i;
  var l = 2 * i + 1;
  var r = 2 * i + 2;

  if (l < N && array[l] > array[largest]) {
    await change_bar_color(array, l, "blue", true);
    largest = l;
    await sleep(speed);
    await change_bar_color(array, l, "white", false);
  }

  if (r < N && array[r] > array[largest]) {
    await change_bar_color(array, r, "blue", true);
    largest = r;
    await sleep(speed);
    await change_bar_color(array, r, "white", false);
  }

  if (largest != i) {
    await swap_bar(array, i, largest);
    await swap(array, i, largest);
    await sleep(speed);
    await heapify(array, N, largest, speed);
  }
}

async function flip(array, i, speed) {
  let temp, start = 0;
  while (start < i) {
    await swap_bar(array, start, i);
    await swap(array, start, i);
    start++;
    i--;
    await sleep(speed);
  }
}

function find_max(array, n) {
  let mi, i;
  for (mi = 0, i = 0; i < n; i++) {
    if (array[i] > array[mi])
      mi = i;
  }

  return mi;
}

async function is_sorted_animation(array, speed) {
  let sorted;
  for (let i = 1; i < array.length; i++) {
    await change_bar_color(array, i, "blue", true);
    await change_bar_color(array, i - 1, "red", true);
    if (array[i] < array[i-1]) {
      sorted = false;
    }
    await sleep(speed);
    await change_bar_color(array, i, "white", false);
    await change_bar_color(array, i - 1, "white", false);
  }
  sorted = true;
  return sorted;
}

function is_sorted(array) {
  for (let i = 1; i < array.length; i++)
    if (array[i] < array[i-1])
      return false;
  return true;
}
