const SIZE_THRESHOLD = 32;

async function BubbleSort(array, speed, n=array.length) {
  do {
    var swapped = false;
    for (var i = 1; i < n; i++) {
      // await change_value_color(array, i-1, "red", true);
      // await change_value_color(array, i, "blue", true);
      // await sleep(50);
      if (array[i-1] > array[i]) {
        await swap_value(array, i-1, i);
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
      await swap_value(array, j, j-1);
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
      await change_value_color(array, min_idx, "red");
      await change_value_color(array, j, "blue");
      await sleep(speed)
      if (array[j] < array[min_idx]) {
        await change_value_color(array, min_idx, "white");
        min_idx = j;
      }
      comparisons++;
      await update_info_box();
      await change_value_color(array, j, "white");
      await change_value_color(array, min_idx, "red");
    }
    await change_value_color(array, min_idx, "white");
    await swap_value(array, min_idx, i);
    await swap(array, min_idx, i);
    await change_value_color(array, min_idx, "white");
    await sleep(speed);
  }
}

async function CocktailShakerSort(array, speed, n=array.length) {
  do {
    var swapped = false;
    for (var i = 0; i < n - 1; i++) {
      if (array[i] > array[i + 1]) {
        comparisons++
        await update_info_box();
        await swap_value(array, i, i+1);
        await swap(array, i, i+1);
        swapped = true;
        await sleep(speed);
      }
      comparisons++
      await update_info_box();
    }
    if (!swapped) break;
    swapped = false;
    for (var i = n - 1; i > 0; i--) {
      if (array[i] > array[i + 1]) {
        comparisons++
        await update_info_box();
        await swap_value(array, i, i+1);
        await swap(array, i, i+1);
        swapped = true;
        await sleep(speed);
      }
      comparisons++
      await update_info_box();
    }
  } while (swapped);
}

async function OddEvenSort(array, speed, n=array.length) {
  var sorted = false;
  while (!sorted) {
    sorted = true;
    for (var i = 1; i < n - 1; i += 2) {
      if (array[i] > array[i+1]) {
        await swap_value(array, i, i+1);
        await swap(array, i, i+1);
        sorted = false;
        await sleep(speed);
      }
      comparisons++;
      await update_info_box();
    }
    for (var i = 0; i < n; i += 2) {
      if (array[i] > array[i+1]) {
        await swap_value(array, i, i+1);
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
        await swap_value(array, i, i+gap);
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
        await swap_value(array, j, j - gap);
        await swap(array, j, j - gap);
        comparisons++;
        await update_info_box();
        await sleep(speed);
      }
      await change_value_height(j, temp);
      array[j] = temp;
      await change_value_color(array, i, "blue");
      // await sleep(speed);
      await change_value_color(array, i, "white");
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
    await swap_value(array, i, j);
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
    await swap_value(array, 0, i);
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
    comparisons++;
    await update_info_box();
  }
}

async function BogoSort(array, speed, n=array.length) {
  var i, j = n;
  while (!is_sorted(array)) {
    for (i = 0; i < n; i++) {
      var index = Math.floor(Math.random() * array.length);
      await swap_value(array, j-i-1, index);
      await swap(array, j-i-1, index);
      await sleep(speed);
    }
  }
}

async function GnomeSort(array, speed, n=array.length) {
  var pos = 0;
  await change_value_color(array, pos, "blue");
  await sleep(speed);
  await change_value_color(array, pos, "white");
  while (pos < n) {
    if (pos == 0 || array[pos] >= array[pos-1]) {
      await change_value_color(array, pos, "blue");
      await sleep(speed);
      await change_value_color(array, pos, "white");
      pos = pos + 1;
      comparisons++;
      await update_info_box();
    } else {
      await swap_value(array, pos, pos-1);
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

async function BitonicSort(array, low, center, direction, speed) {
  if (center > 1) {
    var k = await greatest_power_of_two_less_than(center);

    await BitonicSort(array, low, k, !direction, speed);
    await BitonicSort(array, low + k, center - k, direction, speed);
    await bitonic_merge(array, low, center, direction, speed);
  }
}

async function CycleSort(array, speed, n=array.length) {
  for (let cycle_start = 0; cycle_start < n - 1; cycle_start++) {
    await change_value_color(array, cycle_start, "red");
    var item = array[cycle_start];

    let pos = cycle_start;

    for (let i = cycle_start + 1; i < n; i++) {
      if (array[i] < item) {
        comparisons++;
        await update_info_box();
        pos += 1;
        await change_value_color(array, pos, "blue");
        await sleep(speed);
        await change_value_color(array, pos, "white");
      }
    }

    if (pos == cycle_start) {
      comparisons++;
      await update_info_box();
      await sleep(speed);
      await change_value_color(array, cycle_start, "white");
      continue;
    }

    while (item == array[pos]) {
      comparisons++;
      await update_info_box();
      pos += 1;
      await change_value_color(array, pos, "blue");
      await sleep(speed);
      await change_value_color(array, pos, "white");
    }

    if (pos != cycle_start) {
      let temp = item;
      item = array[pos];
      array[pos] = temp;
      swaps++;
      await update_info_box();
      await change_value_height(pos, temp);
      await sleep(speed);
    }

    while (pos != cycle_start) {
      pos = cycle_start;
      
      for (let i = cycle_start + 1; i < n; i++) {
        if (array[i] < item) {
          comparisons++;
          await update_info_box();
          pos += 1;
          await change_value_color(array, pos, "blue");
          await sleep(speed);
          await change_value_color(array, pos, "white");
        }
      }

      while (item == array[pos]) {
        comparisons++;
        await update_info_box();
        pos += 1;
        await change_value_color(array, pos, "blue");
        await sleep(speed);
        await change_value_color(array, pos, "white");
      }

      if (item != array[pos]) {
        let temp = item;
        item = array[pos];
        array[pos] = temp;
        swaps++;
        await update_info_box();
        await change_value_height(pos, temp);
        await change_value_height(cycle_start, array[pos]);
        await sleep(speed);
      }
    }
    await sleep(speed);
    await change_value_color(array, cycle_start, "white");
  }
}

async function CountingSort(array, k, exp, speed, n=array.length) {
  var count = new Array(k+1).fill(0);
  var output = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    var x = Math.floor(array[i] / exp) % (k+1);
    count[x/* array[i] */]++;
    await change_value_color(array, i, "red");
    // await change_value_color(array, j, "blue", true);
    await sleep(speed);
    await change_value_color(array, i, "white");
    // await change_value_color(array, j, "white", false);
  }

  for (let i = 1; i <= k; i++) {
    count[i] += count[i - 1];
    await change_value_color(array, i - 1, "red");
    await sleep(speed);
    await change_value_color(array, i - 1, "white");
  }

  for (let i = n - 1; i >= 0; i--) {
    var x = Math.floor(array[i] / exp) % (k+1);
    count[x/* array[i] */]--;
    output[count[x/* array[i] */]] = array[i];
    await change_value_color(array, i, "red");
    // await change_value_color(array, j, "blue", true);
    await sleep(speed);
    await change_value_color(array, i, "white");
    // await change_value_color(array, j, "white", false);
  }

  for (let i = 0; i < n; i++) {
    array[i] = output[i];
    await change_value_height(i, output[i]);
    await change_value_color(array, i, "red");
    await sleep(speed);
    await change_value_color(array, i, "white");
  }
}

async function RadixSort(array, speed, n=array.length) {
  let m = Math.max(...array);
  let base = 9; // 10

  for (let exp = 1; Math.floor(m / exp) > 0; exp *= base+1) {
    await CountingSort(array, base, exp, speed);
  }
}

async function DiamondSort(array, start, stop, merge, speed) {
  if (stop - start == 2) {
    if (array[start] > array[stop - 1]) {
      await swap_value(array, start, stop - 1);
      await swap(array, start, stop - 1);
      await sleep(speed);
    }
  } else if (stop - start >= 3) {
    let div = (stop - start) / 4;
    let mid = (stop - start) / 2 + start;

    if (merge) {
      await DiamondSort(array, start, parseInt(mid), true, speed);
      await DiamondSort(array, parseInt(mid), stop, true, speed);
    }

    await DiamondSort(array, parseInt(div + start), parseInt((div * 3) + start), false, speed);
    await DiamondSort(array, start, parseInt(mid), false, speed);
    await DiamondSort(array, parseInt(mid), stop, false, speed);
    await DiamondSort(array, parseInt(div + start), parseInt((div * 3) + start), false, speed);
  }
}
