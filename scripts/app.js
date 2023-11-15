var reverse_btn = document.getElementById("reverse_btn");
var randomize_btn = document.getElementById("randomize_btn");
var sort_btn = document.getElementById("sort_btn");
var bar_container = document.getElementById("bar_container");
var sound_time = Number(document.querySelector(".sound-time-menu").value);
var sound_multiplier = Number(document.querySelector(".sound-menu").value);
var size_menu = document.querySelector(".size-menu");

var min_index = 1;
var max_index = 100;

var audio_ctx = null;

var bars = 100;
var comparisons = 0;
var swaps = 0;
var array = new Array(bars);

document.addEventListener("DOMContentLoaded", function () {
  initialize();
  render_bars(array);
});

size_menu.addEventListener("change", function () {
  comparisons = 0;
  swaps = 0;
  bars = Number(document.querySelector(".size-menu").value);
  array = new Array();
  initialize();
  render_bars(array)
});

randomize_btn.addEventListener("click", function () {
  var speed = Number(document.querySelector(".speed-menu").value);
  comparisons = 0;
  swaps = 0;

  randomize_array(array, speed);
  render_bars(array);
});

reverse_btn.addEventListener("click", function () {
  array.reverse();
  render_bars(array);
})

sort_btn.addEventListener("click", async function () {
  var sorting_alg = Number(document.querySelector(".algo-menu").value);
  var speed = Number(document.querySelector(".speed-menu").value);
  comparisons = 0;
  swaps = 0;
  sound_time = Number(document.querySelector(".sound-time-menu").value);
  sound_multiplier = Number(document.querySelector(".sound-menu").value);

  if (sorting_alg == 1) await BubbleSort(array, speed);
  if (sorting_alg == 2) await InsertionSort(array, speed);
  if (sorting_alg == 3) await QuickSort(array, 0, array.length - 1, speed);
  if (sorting_alg == 4) await SelectionSort(array, speed);
  if (sorting_alg == 5) await CocktailShakerSort(array, speed);
  if (sorting_alg == 6) await OddEvenSort(array, speed);
  if (sorting_alg == 7) await CombSort(array, speed);
  if (sorting_alg == 8) await ShellSort(array, speed);
  if (sorting_alg == 9) await MergeSort(array, 0, array.length - 1, speed);
  if (sorting_alg == 10) await StoogeSort(array, 0, array.length - 1, speed);
  if (sorting_alg == 11) await HeapSort(array, speed);
  if (sorting_alg == 12) await PancakeSort(array, speed);
  if (sorting_alg == 13) await BogoSort(array, speed);
  if (sorting_alg == 14) await GnomeSort(array, speed);
  if (sorting_alg == 15) await TimSort(array, speed);

  console.log(await is_sorted_animation(array, speed));
});
