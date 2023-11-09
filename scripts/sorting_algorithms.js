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

async function BogoSort(array, speed) {
  var i, j = array.length;
  while (!is_sorted(array)) {
    for (i = 0; i < array.length; i++) {
      var index = Math.floor(Math.random() * array.length);
      await swap_bar(array, j-i-1, index);
      await swap(array, j-i-1, index);
      await sleep(speed);
    }
  }
}
