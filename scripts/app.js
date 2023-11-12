let reverse_btn = document.getElementById("reverse_btn");
let randomize_btn = document.getElementById("randomize_btn");
let sort_btn = document.getElementById("sort_btn");
let bar_container = document.getElementById("bar_container");
let sound_time = Number(document.querySelector(".sound-time-menu").value);
let sound_multiplier = Number(document.querySelector(".sound-menu").value);
let size_menu = document.querySelector(".size-menu");

let min_index = 1;
let max_index = 100;

let audio_ctx = null;

let bars = 100;
let array = new Array(bars);

document.addEventListener("DOMContentLoaded", function () {
  initialize();
  render_bars(array);
});

size_menu.addEventListener("change", function () {
  bars = Number(document.querySelector(".size-menu").value);
  array = new Array();
  initialize();
  render_bars(array)
});

randomize_btn.addEventListener("click", function () {
  let speed = Number(document.querySelector(".speed-menu").value);

  randomize_array(array, speed);
  render_bars(array);
});

reverse_btn.addEventListener("click", function () {
  array.reverse();
  render_bars(array);
})

sort_btn.addEventListener("click", async function () {
  let sorting_alg = Number(document.querySelector(".algo-menu").value);
  let speed = Number(document.querySelector(".speed-menu").value);
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
