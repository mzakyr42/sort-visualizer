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
let unsorted_array = new Array(bars);

document.addEventListener("DOMContentLoaded", function () {
  initialize();
  render_bars(unsorted_array);
});

size_menu.addEventListener("change", function () {
  bars = Number(document.querySelector(".size-menu").value);
  unsorted_array = new Array();
  initialize();
  render_bars(unsorted_array)
});

randomize_btn.addEventListener("click", function () {
  let speed = Number(document.querySelector(".speed-menu").value);

  randomize_array(unsorted_array, speed);
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
  if (sorting_alg == 13) BogoSort(unsorted_array, speed);
});
