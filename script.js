//
// VARIABLES
//

let reverse_btn = document.getElementById("reverse_btn");
let randomize_btn = document.getElementById("randomize_btn");
let sort_btn = document.getElementById("sort_btn");
let bar_container = document.getElementById("bar_container");
let sound_time = Number(document.querySelector(".sound-time-menu").value);
let sound_multiplier = Number(document.querySelector(".sound-menu").value);

let audio_ctx = null;

let bars = 100;
let unsorted_array = new Array(bars);

//
// HELPER
//
//

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
    unsorted_array[i] = i;
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

function randomize_array(array) {
  let current_index = array.length, random_index;

  while (current_index > 0) {
    random_index = random_number(0, array.length - 1);
    current_index--;

    swap(array, current_index, random_index);
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

//
// ALGORITHMS
//

async function InsertionSort(array, speed) {
  let i, j, key;

  i = 1;
  while (i < array.length) {
    j = i;
    while (j > 0 && array[j-1] > array[j]) {
      await swap_bar(array, j, j-1);
      await swap(array, j, j-1);
      await sleep(speed);
      j = j - 1;
    }
    i = i + 1;
  }
}

async function BubbleSort(array, speed) {
  do {
    var swapped = false;
    for (let i = 1; i < array.length; i++) {
      // await change_bar_color(array, i-1, "red", true);
      // await change_bar_color(array, i, "blue", true);
      // await sleep(50);
      if (array[i-1] > array[i]) {
        await swap_bar(array, i-1, i);
        await swap(array, i-1, i);
        swapped = true;
        await sleep(speed);
      }
    }
  } while (swapped);
}

async function QuickSort(array, low, high, speed) {
  if (low < high) {
    let piv = await partition(array, low, high, speed);

    // await Promise.all([
    //   QuickSort(array, low, piv - 1, speed),
    //   QuickSort(array, piv + 1, high, speed),
    // ]);
    await QuickSort(array, low, piv - 1, speed);
    await QuickSort(array, piv + 1, high, speed);
  }
}

async function SelectionSort(array, speed) {
  for (let i = 0; i < array.length - 1; i++) {
    let min_idx = i;
    for (let j = i + 1; j < array.length; j++) {
      await change_bar_color(array, min_idx, "red", true);
      await change_bar_color(array, j, "blue", true);
      await sleep(speed)
      if (array[j] < array[min_idx]) {
        await change_bar_color(array, min_idx, "white", false);
        min_idx = j;
      }
      await change_bar_color(array, j, "white", false);
      await change_bar_color(array, min_idx, "red", false);
    }
    await change_bar_color(array, min_idx, "white", false);
    await swap_bar(array, min_idx, i);
    await swap(array, min_idx, i);
    await change_bar_color(array, min_idx, "white", false);
    await sleep(speed);
  }
}

async function CocktailShakerSort(array, speed) {
  do {
    var swapped = false;
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] > array[i + 1]) {
        await swap_bar(array, i, i+1);
        await swap(array, i, i+1);
        swapped = true;
        await sleep(speed);
      }
    }
    if (!swapped) break;
    swapped = false;
    for (let i = array.length - 1; i > 0; i--) {
      if (array[i] > array[i + 1]) {
        await swap_bar(array, i, i+1);
        await swap(array, i, i+1);
        swapped = true;
        await sleep(speed);
      }
    }
  } while (swapped);
}

async function OddEvenSort(array, speed) {
  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 1; i < array.length - 1; i += 2) {
      if (array[i] > array[i+1]) {
        await swap_bar(array, i, i+1);
        await swap(array, i, i+1);
        sorted = false;
        await sleep(speed);
      }
    }
    for (let i = 0; i < array.length; i += 2) {
      if (array[i] > array[i+1]) {
        await swap_bar(array, i, i+1);
        await swap(array, i, i+1);
        sorted = false;
        await sleep(speed);
      }
    }
  }
}

async function CombSort(array, speed) {
  let gap = array.length;
  let shrink = 1.3;
  let sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / shrink);

    if (gap <= 1) {
      gap = 1
      sorted = true;
    }

    let i = 0;
    while (i + gap < array.length) {
      if (array[i] > array[i+gap]) {
        await swap_bar(array, i, i+gap);
        await swap(array, i, i+gap);
        sorted = false;
        await sleep(speed);
      }

      i += 1;
    }
  }
}

async function ShellSort(array, speed) {
  for (let gap = Math.floor(array.length/2); gap > 0; gap = Math.floor(gap/2)) {
    for (let i = gap; i < array.length; i += 1) {
      let temp = array[i];
      for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
        await swap_bar(array, j, j - gap);
        await swap(array, j, j - gap);
        await sleep(speed);
      }
      await change_bar_height(j, temp);
      array[j] = temp;
      await change_bar_color(array, i, "blue", true);
      await change_bar_color(array, i, "white", false);
    }
  }
}

async function MergeSort(array, left, right, speed) {
  if (left < right) {
    let mid = parseInt((left + right) >> 1);
    await MergeSort(array, left, mid, speed);
    await MergeSort(array, mid+1, right, speed);
    await merge(array, left, mid, right, speed);
  }
}

async function StoogeSort(array, i, j, speed) {
  if (array[i] > array[j]) {
    await swap_bar(array, i, j);
    await swap(array, i, j);
    await sleep(speed);
  }
  if ((j - i + 1) > 2) {
    let t = Math.floor((j - i + 1) / 3);
    await StoogeSort(array, i, j - t, speed);
    await StoogeSort(array, i + t, j, speed);
    await StoogeSort(array, i, j - t, speed);
  }
}

async function HeapSort(array, speed) {
  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
    await heapify(array, array.length, i, speed);
  }

  for (let i = array.length - 1; i > 0; i--) {
    await swap_bar(array, 0, i);
    await swap(array, 0, i);
    await sleep(speed);

    await heapify(array, i, 0, speed);
  }
}

async function PancakeSort(array, speed) {
  for (let current_size = array.length; current_size > 1; current_size--) {
    let mi = await find_max(array, current_size);
    if (mi != current_size - 1) {
      await flip(array, mi, speed);
      await flip(array, current_size - 1, speed);
    }
  }
}

//
// EVENT LISTENER
//

document.addEventListener("DOMContentLoaded", function () {
  initialize();
  render_bars(unsorted_array);
});

randomize_btn.addEventListener("click", function () {
  randomize_array(unsorted_array);
  render_bars(unsorted_array);
});

reverse_btn.addEventListener("click", function () {
  unsorted_array.reverse();
  render_bars(unsorted_array);
})

sort_btn.addEventListener("click", function () {
  let sorting_alg = Number(document.querySelector(".algo-menu").value);
  let speed = Number(document.querySelector(".speed-menu").value);
  sound_time = Number(document.querySelector(".sound-time-menu").value);
  sound_multiplier = Number(document.querySelector(".sound-menu").value);

  if (sorting_alg == 1) BubbleSort(unsorted_array, speed);
  if (sorting_alg == 2) InsertionSort(unsorted_array, speed);
  if (sorting_alg == 3) QuickSort(unsorted_array, 0, unsorted_array.length - 1, speed);
  if (sorting_alg == 4) SelectionSort(unsorted_array, speed);
  if (sorting_alg == 5) CocktailShakerSort(unsorted_array, speed);
  if (sorting_alg == 6) OddEvenSort(unsorted_array, speed);
  if (sorting_alg == 7) CombSort(unsorted_array, speed);
  if (sorting_alg == 8) ShellSort(unsorted_array, speed);
  if (sorting_alg == 9) MergeSort(unsorted_array, 0, unsorted_array.length - 1, speed);
  if (sorting_alg == 10) StoogeSort(unsorted_array, 0, unsorted_array.length - 1, speed);
  if (sorting_alg == 11) HeapSort(unsorted_array, speed);
  if (sorting_alg == 12) PancakeSort(unsorted_array, speed);
});
