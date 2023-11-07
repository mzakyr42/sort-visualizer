//
// VARIABLES
//

let randomize_btn = document.getElementById("randomize_btn");
let sort_btn = document.getElementById("sort_btn");
let bar_container = document.getElementById("bar_container");

let audio_ctx = null;

let minRange = 1;
let maxRange = 50;
let bars = 50;
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
  for (let i = 0; i < bars; i++) {
    unsorted_array[i] = random_number(minRange, maxRange);
  }
}

function render_bars(array) {
  bar_container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    let bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = array[i] * 10 + "px";
    bar_container.appendChild(bar);
  }
  // bar_container.style.transform = "rotate(180deg)";
}

function swap(array, i, j) {
  let temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

function swap_bar(array, i, j) {
  let bars = document.getElementsByClassName("bar");
  bars[i].style.height = array[j] * 10 + "px";
  bars[i].style.backgroundColor = "red";
  bars[j].style.height = array[i] * 10 + "px";
  bars[j].style.backgroundColor = "blue";
  for (let k = 0; k < bars.length; k++) {
    if (k !== i && k !== j) {
      bars[k].style.backgroundColor = "white";
    }
  }
  play_sound(array[i] * 10);
  play_sound(array[j] * 10);
}

function change_bar_color(array, i, color, playsound) {
  let bars = document.getElementsByClassName("bar");
  bars[i].style.backgroundColor = color;
  if (playsound) play_sound(array[i] * 10);
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
      await change_bar_color(array, min_idx, "red", true);
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

//
// EVENT LISTENER
//

document.addEventListener("DOMContentLoaded", function () {
  initialize();
  render_bars(unsorted_array);
});

randomize_btn.addEventListener("click", function () {
  initialize();
  render_bars(unsorted_array);
});

sort_btn.addEventListener("click", function () {
  let sorting_alg = Number(document.querySelector(".algo-menu").value);
  let speed = Number(document.querySelector(".speed-menu").value);

  if (sorting_alg == 1) BubbleSort(unsorted_array, speed);
  if (sorting_alg == 2) InsertionSort(unsorted_array, speed);
  if (sorting_alg == 3) QuickSort(unsorted_array, 0, unsorted_array.length - 1, speed);
  if (sorting_alg == 4) SelectionSort(unsorted_array, speed);
  if (sorting_alg == 5) CocktailShakerSort(unsorted_array, speed);
  if (sorting_alg == 6) OddEvenSort(unsorted_array, speed);
  if (sorting_alg == 7) CombSort(unsorted_array, speed);
});
