var reverse_btn = document.getElementById("reverse_btn");
var randomize_btn = document.getElementById("randomize_btn");
var sort_btn = document.getElementById("sort_btn");
var value_container = document.getElementById("value_container");
// var sound_time = Number(document.querySelector(".sound-time-menu").value);
var sound_multiplier = Number(document.querySelector(".sound-menu").value);
var size_menu = document.querySelector(".size-menu");
var visualizer_menu = document.querySelector(".visualizer-menu");

var min_index = 1;
var max_index = 100;

var audio_ctx = null;

let visualization = 1;
// 1. lines
// 2. points

var values = 100;
var comparisons = 0;
var swaps = 0;
var array = new Array(values);

let size_factor;
if (values <= 5) {
  size_factor = 100;
} else if (values > 5 && values <= 100) {
  size_factor = 3.8;
} else if (values > 300) {
  size_factor = 1;
}

document.addEventListener("DOMContentLoaded", function () {
  initialize();
  render_values(array);
});

size_menu.addEventListener("change", function () {
  comparisons = 0;
  swaps = 0;
  values = Number(document.querySelector(".size-menu").value);
  array = new Array();
  if (values <= 5) {
    size_factor = 100;
  } else if (values > 5 && values <= 100) {
    size_factor = 3.8;
  } else if (values > 100) {
    size_factor = 1;
  }

  initialize();
  render_values(array)
});

visualizer_menu.addEventListener("change", function () {
  visualization = Number(document.querySelector(".visualizer-menu").value);

  render_values(array);
})

randomize_btn.addEventListener("click", function () {
  var speed = Number(document.querySelector(".speed-menu").value);
  comparisons = 0;
  swaps = 0;

  randomize_array(array, speed);
  render_values(array);
});

reverse_btn.addEventListener("click", function () {
  array.reverse();
  render_values(array);
})

sort_btn.addEventListener("click", async function () {
  var sorting_alg = Number(document.querySelector(".algo-menu").value);
  var speed = Number(document.querySelector(".speed-menu").value);
  comparisons = 0;
  swaps = 0;
  // sound_time = Number(document.querySelector(".sound-time-menu").value);
  sound_multiplier = Number(document.querySelector(".sound-menu").value);
  if (values <= 5) {
    size_factor = 100;
  } else if (values > 5 && values <= 100) {
    size_factor = 3.8;
  } else if (values > 300) {
    size_factor = 1;
  }

  // if (sorting_alg == 1) await BubbleSort(array, speed);
  // if (sorting_alg == 2) await InsertionSort(array, speed);
  // if (sorting_alg == 3) await QuickSort(array, 0, array.length - 1, speed);
  // if (sorting_alg == 4) await SelectionSort(array, speed);
  // if (sorting_alg == 5) await CocktailShakerSort(array, speed);
  // if (sorting_alg == 6) await OddEvenSort(array, speed);
  // if (sorting_alg == 7) await CombSort(array, speed);
  // if (sorting_alg == 8) await ShellSort(array, speed);
  // if (sorting_alg == 9) await MergeSort(array, 0, array.length - 1, speed);
  // if (sorting_alg == 10) await StoogeSort(array, 0, array.length - 1, speed);
  // if (sorting_alg == 11) await HeapSort(array, speed);
  // if (sorting_alg == 12) await PancakeSort(array, speed);
  // if (sorting_alg == 13) await BogoSort(array, speed);
  // if (sorting_alg == 14) await GnomeSort(array, speed);
  // if (sorting_alg == 15) await TimSort(array, speed);
  // if (sorting_alg == 16) await BitonicSort(array, 0, array.length, true, speed);

  switch (sorting_alg) {
    case 1: await BubbleSort(array, speed); break;
    case 2: await InsertionSort(array, speed); break;
    case 3: await QuickSort(array, 0, array.length - 1, speed); break;
    case 4: await SelectionSort(array, speed); break;
    case 5: await CocktailShakerSort(array, speed); break;
    case 6: await OddEvenSort(array, speed); break;
    case 7: await CombSort(array, speed); break;
    case 8: await ShellSort(array, speed); break;
    case 9: await MergeSort(array, 0, array.length - 1, speed); break;
    case 10: await StoogeSort(array, 0, array.length - 1, speed); break;
    case 11: await HeapSort(array, speed); break;
    case 12: await PancakeSort(array, speed); break;
    case 13: await BogoSort(array, speed); break;
    case 14: await GnomeSort(array, speed); break;
    case 15: await TimSort(array, speed); break;
    case 16: await BitonicSort(array, 0, array.length, true, speed); break;
    default: console.log('how do we get here?'); break;
  }
});
