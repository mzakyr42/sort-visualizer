const SIZE_THRESHOLD = 16;

async function BubbleSort(array, speed, n=array.length) {
  do {
    var swapped = false;
    for (var i = 1; i < n; i++) {
      // await change_bar_color(array, i-1, "red", true);
      // await change_bar_color(array, i, "blue", true);
      // await sleep(50);
      if (array[i-1] > array[i]) {
        await swap_bar(array, i-1, i);
        await swap(array, i-1, i);
        swapped = true;
        await sleep(speed);
      }
      comparisons++;
      await update_info_box();
    }
  } while (swapped);
}

async function InsertionSort(array, speed, left=0, right=array.length) {
  var i, j, key;

  i = left + 1;
  while (i < right) {
    j = i;
    while (j > left && array[j-1] > array[j]) {
      await swap_bar(array, j, j-1);
      await swap(array, j, j-1);
      await sleep(speed);
      comparisons++;
      await update_info_box();
      j = j - 1;
    }
    i = i + 1;
  }
}

async function QuickSort(array, low, high, speed) {
  if (low < high) {
    var piv = await partition(array, low, high, speed);

    // await Promise.all([
    //   QuickSort(array, low, piv - 1, speed),
    //   QuickSort(array, piv + 1, high, speed),
    // ]);
    await QuickSort(array, low, piv - 1, speed);
    await QuickSort(array, piv + 1, high, speed);
  }
}

async function SelectionSort(array, speed, n=array.length) {
  for (var i = 0; i < n - 1; i++) {
    var min_idx = i;
    for (var j = i + 1; j < n; j++) {
      await change_bar_color(array, min_idx, "red", true);
      await change_bar_color(array, j, "blue", true);
      await sleep(speed)
      if (array[j] < array[min_idx]) {
        await change_bar_color(array, min_idx, "white", false);
        min_idx = j;
      }
      comparisons++;
      await update_info_box();
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

async function CocktailShakerSort(array, speed, n=array.length) {
  do {
    var swapped = false;
    for (var i = 0; i < n - 1; i++) {
      if (array[i] > array[i + 1]) {
        await swap_bar(array, i, i+1);
        await swap(array, i, i+1);
        swapped = true;
        await sleep(speed);
      }
    }
    if (!swapped) break;
    swapped = false;
    for (var i = n - 1; i > 0; i--) {
      if (array[i] > array[i + 1]) {
        await swap_bar(array, i, i+1);
        await swap(array, i, i+1);
        swapped = true;
        await sleep(speed);
      }
    }
  } while (swapped);
}

async function OddEvenSort(array, speed, n=array.length) {
  var sorted = false;
  while (!sorted) {
    sorted = true;
    for (var i = 1; i < n - 1; i += 2) {
      if (array[i] > array[i+1]) {
        await swap_bar(array, i, i+1);
        await swap(array, i, i+1);
        sorted = false;
        await sleep(speed);
      }
      comparisons++;
      await update_info_box();
    }
    for (var i = 0; i < n; i += 2) {
      if (array[i] > array[i+1]) {
        await swap_bar(array, i, i+1);
        await swap(array, i, i+1);
        sorted = false;
        await sleep(speed);
      }
      comparisons++;
      await update_info_box();
    }
  }
}

async function CombSort(array, speed, n=array.length) {
  var gap = n;
  var shrink = 1.3;
  var sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / shrink);

    if (gap <= 1) {
      gap = 1
      sorted = true;
    }

    var i = 0;
    while (i + gap < n) {
      if (array[i] > array[i+gap]) {
        await swap_bar(array, i, i+gap);
        await swap(array, i, i+gap);
        sorted = false;
        await sleep(speed);
      }
      comparisons++;
      await update_info_box();

      i += 1;
    }
  }
}

async function ShellSort(array, speed, n=array.length) {
  for (var gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
    for (var i = gap; i < n; i += 1) {
      var temp = array[i];
      for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
        await swap_bar(array, j, j - gap);
        await swap(array, j, j - gap);
        comparisons++;
        await update_info_box();
        await sleep(speed);
      }
      await change_bar_height(j, temp);
      array[j] = temp;
      await change_bar_color(array, i, "blue", true);
      // await sleep(speed);
      await change_bar_color(array, i, "white", false);
    }
  }
}

async function MergeSort(array, left, right, speed) {
  if (left < right) {
    var mid = parseInt((left + right) >> 1);
    await MergeSort(array, left, mid, speed);
    await MergeSort(array, mid+1, right, speed);
    await merge(array, left, mid, right, speed);
  }
}

async function StoogeSort(array, i, j, speed) {
  if (array[i] > array[j]) {
    await swap_bar(array, i, j);
    await swap(array, i, j);
    comparisons++;
    await update_info_box();
    await sleep(speed);
  }
  if ((j - i + 1) > 2) {
    var t = Math.floor((j - i + 1) / 3);
    await StoogeSort(array, i, j - t, speed);
    await StoogeSort(array, i + t, j, speed);
    await StoogeSort(array, i, j - t, speed);
  }
}

async function HeapSort(array, speed, low=0, high=array.length) {
  var n = high - low;
  for (var i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(array, n, i, speed);
  }

  for (var i = n - 1; i > 0; i--) {
    await swap_bar(array, 0, i);
    await swap(array, 0, i);
    await sleep(speed);

    await heapify(array, i, 0, speed);
  }
}

async function PancakeSort(array, speed, n=array.length) {
  for (var current_size = n; current_size > 1; current_size--) {
    var mi = await find_max(array, current_size);
    if (mi != current_size - 1) {
      comparisons++;
      await update_info_box();
      await flip(array, mi, speed);
      await flip(array, current_size - 1, speed);
    }
  }
}

async function BogoSort(array, speed, n=array.length) {
  var i, j = n;
  while (!is_sorted(array)) {
    for (i = 0; i < n; i++) {
      var index = Math.floor(Math.random() * array.length);
      await swap_bar(array, j-i-1, index);
      await swap(array, j-i-1, index);
      await sleep(speed);
    }
  }
}

async function GnomeSort(array, speed, n=array.length) {
  var pos = 0;
  await change_bar_color(array, pos, "blue", true);
  await sleep(speed);
  await change_bar_color(array, pos, "white", false);
  while (pos < n) {
    if (pos == 0 || array[pos] >= array[pos-1]) {
      await change_bar_color(array, pos, "blue", true);
      await sleep(speed);
      await change_bar_color(array, pos, "white", false);
      pos = pos + 1;
      comparisons++;
      await update_info_box();
    } else {
      await swap_bar(array, pos, pos-1);
      await swap(array, pos, pos-1);
      pos = pos - 1;
      await sleep(speed);
    }
  }
}

async function TimSort(array, speed, n=array.length) {
  var min_run = min_run_length(MIN_MERGE);

  for (var i = 0; i < n; i += min_run) {
    await InsertionSort(array, speed, i, Math.min(
      (i + MIN_MERGE /* - 1 */), (n /*- 1 */)));
  }

  for (var size = min_run; size < n; size = 2 * size) {
    for (var left = 0; left < n; left += 2 * size) {
      var mid = left + size - 1;
      var right = Math.min((left + 2 * size - 1), (n - 1));

      if (mid < right) await merge(array, left, mid, right, speed);
    }
  }
}
