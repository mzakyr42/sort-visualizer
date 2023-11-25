const MIN_MERGE = 32;

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
  node.gain.value = 0.1;
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
  for (var i = 0; i < values; i++) {
    // array[i] = random_number(min_index, max_index);
    array[i] = i+1;
  }
}

function render_values(array) {
  value_container.innerHTML = "";
  for (var i = 0; i < array.length; i++) {
    var value = document.createElement("div");
    value.classList.add("value");
    if (visualization == 1) { value.style.height = array[i] * size_factor + "px"; }
    else if (visualization == 2) { value.style.marginTop = array[i] * size_factor + "px"; }
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
  swaps++;
  update_info_box();
}

function swap_value(array, i, j) {
  var values = document.getElementsByClassName("value");
  if (visualization == 1) { values[i].style.height = array[j] * size_factor + "px"; }
  else if (visualization == 2) { values[i].style.marginTop = array[j] * size_factor + "px"; }
  values[i].style.backgroundColor = "red";
  if (visualization == 1) values[j].style.height = array[i] * size_factor + "px";
  else if (visualization == 2) { values[j].style.marginTop = array[i] * size_factor + "px"; }
  values[j].style.backgroundColor = "blue";
  for (var k = 0; k < values.length; k++) {
    if (k !== i && k !== j) {
      values[k].style.backgroundColor = "white";
    }
  }
  play_sound(array[i] * sound_multiplier);
  play_sound(array[j] * sound_multiplier);
}

function change_value_color(array, i, color, playsound) {
  var values = document.getElementsByClassName("value");
  values[i].style.backgroundColor = color;
  if (playsound) play_sound(parseInt(array[i]) * sound_multiplier);
}

function change_value_height(i, height) {
  var values = document.getElementsByClassName("value");
  if (visualization == 1) { values[i].style.height = height * size_factor + "px"; }
  else if (visualization == 2) { values[i].style.marginTop = height * size_factor + "px"; } 
}

async function partition(array, low, high, speed) {
  var pivot = array[high];

  var i = low - 1;

  for (var j = low; j <= high - 1; j++) {
    if (array[j] < pivot) {
      i++;
      await swap_value(array, i, j);
      await swap(array, i, j);
      await sleep(speed);
    }
    comparisons++;
    await update_info_box();
  }

  await swap_value(array, i + 1, high);
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
      await change_value_height(k, L[i]);
      await change_value_color(array, k, "red", true);
      array[k] = L[i];
      i++;
      await sleep(speed);
      await change_value_color(array, k, "white", false);
    } else {
      await change_value_height(k, R[j]);
      await change_value_color(array, k, "blue", true);
      array[k] = R[j];
      j++;
      await sleep(speed);
      await change_value_color(array, k, "white", false);
    }
    comparisons++;
    await update_info_box();
    k++;
  }

  while (i < n1) {
    await change_value_height(k, L[i]);
    await change_value_color(array, k, "red", true);
    array[k] = L[i];
    i++;
    await sleep(speed);
    await change_value_color(array, k, "white", false);
    k++;
  }
  comparisons++;
  await update_info_box();

  while (j < n2) {
    await change_value_height(k, R[j]);
    await change_value_color(array, k, "blue", true);
    array[k] = R[j];
    j++;
    await sleep(speed);
    await change_value_color(array, k, "white", false);
    k++;
  }
  comparisons++;
  await update_info_box();
}

async function heapify(array, N, i, speed) {
  var largest = i;
  var l = 2 * i + 1;
  var r = 2 * i + 2;

  if (l < N && array[l] > array[largest]) {
    await change_value_color(array, l, "blue", true);
    largest = l;
    await sleep(speed);
    await change_value_color(array, l, "white", false);
  }
  comparisons++;
  await update_info_box();

  if (r < N && array[r] > array[largest]) {
    await change_value_color(array, r, "blue", true);
    largest = r;
    await sleep(speed);
    await change_value_color(array, r, "white", false);
  }
  comparisons++;
  await update_info_box();

  if (largest != i) {
    await swap_value(array, i, largest);
    await swap(array, i, largest);
    await sleep(speed);
    await heapify(array, N, largest, speed);
  }
}

async function flip(array, i, speed) {
  var temp, start = 0;
  while (start < i) {
    await swap_value(array, start, i);
    await swap(array, start, i);
    start++;
    i--;
    await sleep(speed);
  }
}

async function bitonic_merge(array, low, center, direction, speed) {
  if (center > 1) {
    var k = await greatest_power_of_two_less_than(center);

    for (let i = low; i < low + center - k; i++) {
      if ((array[i] > array[i+k] && direction === true) || 
        (array[i] < array[i+k] && direction === false)) {
        await swap_value(array, i, i+k);
        await swap(array, i, i+k);
        await sleep(speed);
      }
    }

    await bitonic_merge(array, low, k, direction, speed);
    await bitonic_merge(array, low + k, center - k, direction, speed);
  }
}

function find_max(array, n) {
  var mi, i;
  for (mi = 0, i = 0; i < n; i++) {
    if (array[i] > array[mi])
      mi = i;
    comparisons++;
    update_info_box();
  }

  return mi;
}

function update_info_box() {
  document.getElementById("comparisons").innerText = comparisons;
  document.getElementById("swaps").innerText = swaps;
}

async function is_sorted_animation(array, speed) {
  var sorted;
  for (var i = 1; i < array.length; i++) {
    await change_value_color(array, i, "blue", true);
    await change_value_color(array, i - 1, "red", true);
    if (array[i] < array[i-1]) {
      sorted = false;
    }
    await sleep(speed);
    await change_value_color(array, i, "white", false);
    await change_value_color(array, i - 1, "white", false);
  }
  sorted = true;
  return sorted;
}

function is_sorted(array) {
  for (var i = 1; i < array.length; i++)
    if (array[i] < array[i-1])
      comparisons++;
      update_info_box();
      return false;
  return true;
}

function min_run_length(n)
{
    
    var r = 0;
    while (n >= MIN_MERGE)
    {
        r |= (n & 1);
        n >>= 1;
    }
    return n + r + 1;
}

function greatest_power_of_two_less_than(n) {
  var k = 1;
  while (k > 0 && k < n) {
    k = k << 1;
  }
  return k >> 1;
}
