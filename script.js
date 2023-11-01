//
// VARIABLES
//

let randomize_btn = document.getElementById("randomize_btn");
let sort_btn = document.getElementById("sort_btn");
let bar_container = document.getElementById("bar_container");

let minRange = 1;
let maxRange = 30;
let bars = 50;
let unsorted_array = new Array(bars);

//
// HELPER
//

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
}

function change_bar_color(i, color) {
  let bars = document.getElementsByClassName("bar");
  bars[i].style.backgroundColor = color;
}

//
// ALGORITHMS
//

async function SelectionSort(array) {
  for (let i = 0; i < array.length; i++) {
    let min = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[min]) {
        min = j;
      }
    }
    if (min != i) {
      await swap_bar(array, i, min);
      await swap(array, i, min);
    }
    await sleep(100);
  }

  return array;
}

async function BubbleSort(array) {
  do {
    var swapped = false;
    for (let i = 1; i < array.length; i++) {
      if (array[i-1] > array[i]) {
        await swap_bar(array, i-1, i);
        await swap(array, i-1, i);
        swapped = true;
        await sleep(100);
      }
    }
  } while (swapped);
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
  let sorted_array;
  let sorting_alg = Number(document.querySelector(".algo-menu").value);

  if (sorting_alg == 1) sorted_array = BubbleSort(unsorted_array);
  if (sorting_alg == 2) sorted_array = SelectionSort(unsorted_array);

  console.log(sorted_array)
});
