var reverse_btn = document.getElementById("reverse_btn");
var randomize_btn = document.getElementById("randomize_btn");
var sort_btn = document.getElementById("sort_btn");
var initialize_btn = document.getElementById("initialize_btn");
var value_container = document.getElementById("value_container");
// var sound_time = Number(document.querySelector(".sound-time-menu").value);
// var sound_multiplier = Number(document.querySelector(".sound-menu").value);
var size_menu = document.querySelector(".size-menu");
var visualizer_menu = document.querySelector(".visualizer-menu");
var speed = Number(document.querySelector(".speed-menu").value);

var audio_ctx = null;

let visualization = 1;
// 1. lines
// 2. points
// 3. colorfull lines/hsl lines

var values = 128;
var array = new Array(values);

let size_factor;
if (values < 8) {
  size_factor = 100;
} else if (values > 8 && values <= 128) {
  size_factor = 3.8;
} else if (values > 128 && values <= 512) {
  size_factor = 1;
} else if (values > 512) {
  size_factor = 0.5;
}

document.addEventListener("DOMContentLoaded", function () {
  initialize();
  render_values(array);
});

size_menu.addEventListener("change", function () {
  comparisons = 0;
  swaps = 0;
  values = Number(document.querySelector(".size-menu").value);
  array = new Array(values);
  max = Math.max(...array);
  if (values < 8) {
    size_factor = 100;
  } else if (values > 8 && values <= 128) {
    size_factor = 3.8;
  } else if (values > 128 && values <= 512) {
    size_factor = 1;
  } else if (values > 512) {
    size_factor = 0.5;
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

  randomize_array(array, speed);
  render_values(array);
});

reverse_btn.addEventListener("click", function () {
  var speed = Number(document.querySelector(".speed-menu").value);

  reverse_array(array, speed);
})

sort_btn.addEventListener("click", async function () {
  var sorting_alg = Number(document.querySelector(".algo-menu").value);
  speed = Number(document.querySelector(".speed-menu").value);
  comparisons = 0;
  swaps = 0;
  // sound_time = Number(document.querySelector(".sound-time-menu").value);
  // sound_multiplier = Number(document.querySelector(".sound-menu").value);
  if (values < 8) {
    size_factor = 100;
  } else if (values > 8 && values <= 128) {
    size_factor = 3.8;
  } else if (values > 128 && values <= 512) {
    size_factor = 1;
  } else if (values > 512) {
    size_factor = 0.5;
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
    case 4: alert("Selection Sort Sound is broken so don't wear headset with full volume!"); await SelectionSort(array, speed); break;
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
    case 17: await CycleSort(array, speed); break;
    case 18: await CountingSort(array, Math.max(...array), 1, speed); break;
    case 19: await RadixSort(array, speed); break;
    case 20: await DiamondSort(array, 0, array.length, true, speed); break;
    case 21: await CircleSort(array, speed); break;
    case 22: await BitonicSortIterative(array, speed); break;
    case 23: await DiamondSortIterative(array, speed); break;
    case 24: await CreaseSort(array, speed); break;
    case 25: await FoldSort(array, speed); break;
    case 26: await WeaveSortRecursive(array, speed); break;
    case 27: await WeaveSortIterative(array, speed); break;
    case 28: await StalinSort(array, speed); break;
    case 29: await PairwiseSortRecursive(array, 0, array.length, 1, speed); break;
    case 30: await PairwiseSortIterative(array, speed); break;
    case 31: await BozoSort(array, speed); break;
    case 32: await OddEvenMergeSortRecursive(array, 0, array.length, speed); break;
    case 33: await OddEvenMergeSortIterative(array, speed); break;
    case 34: await MinHeapSort(array, speed); break;
    case 35: await SimpleSort(array, speed); break;
    case 36: await QuickSortParallel(array, 0, array.length - 1, speed); break;
    case 37: await MergeSortParallel(array, 0, array.length - 1, speed); break;
    case 38: await BitonicSortParallel(array, 0, array.length, true, speed); break;
    case 39: await OddEvenMergeSortParallel(array, 0, array.length, speed); break;
    case 40: await PairwiseSortParallel(array, 0, array.length, 1, speed); break;
    case 41: await MergeSortIterative(array, speed); break;
    case 42: await MergeSortInPlace(array, 0, array.length - 1, speed); break;
    default: console.log('how do we get here?'); break;
  }
});

initialize_btn.addEventListener("click", function () {
  array = new Array(values);

  initialize();
  render_values(array);
});
