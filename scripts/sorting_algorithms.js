const SIZE_THRESHOLD = 32;

// utils

async function partition(array, low, high, speed) {
  var pivot = array[high];

  var i = low - 1;

  for (var j = low; j <= high - 1; j++) {
    if (array[j] < pivot) {
      i++;
      await swap_value(array, i, j);
      await swap(array, i, j);
      await sleep(speed);
    }
  }

  await swap_value(array, i + 1, high);
  await swap(array, i + 1, high);
  await sleep(speed);
  return i + 1;
}

async function merge(array, left, mid, right, speed) {
  var n1 = mid - left + 1;
  var n2 = right - mid;

  var L = new Array(n1);
  var R = new Array(n2);

  for (var i = 0; i < n1; i++)
    L[i] = array[left + i];
  for (var j = 0; j < n2; j++)
    R[j] = array[mid + 1 + j];

  var i = 0;
  var j = 0;
  var k = left;

  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      await change_value_height(k, L[i]);
      await change_value_color(array, k, "red");
      array[k] = L[i];
      i++;
      await sleep(speed);
      await change_value_color(array, k, "white");
    } else {
      await change_value_height(k, R[j]);
      await change_value_color(array, k, "blue");
      array[k] = R[j];
      j++;
      await sleep(speed);
      await change_value_color(array, k, "white");
    }
    k++;
  }

  while (i < n1) {
    await change_value_height(k, L[i]);
    await change_value_color(array, k, "red");
    array[k] = L[i];
    i++;
    await sleep(speed);
    await change_value_color(array, k, "white");
    k++;
  }

  while (j < n2) {
    await change_value_height(k, R[j]);
    await change_value_color(array, k, "blue");
    array[k] = R[j];
    j++;
    await sleep(speed);
    await change_value_color(array, k, "white");
    k++;
  }
}

async function heapify(array, N, i, speed) {
  var largest = i;
  var l = 2 * i + 1;
  var r = 2 * i + 2;

  if (l < N && array[l] > array[largest]) {
    await change_value_color(array, l, "blue");
    largest = l;
    await sleep(speed);
    await change_value_color(array, l, "white");
  }

  if (r < N && array[r] > array[largest]) {
    await change_value_color(array, r, "blue");
    largest = r;
    await sleep(speed);
    await change_value_color(array, r, "white");
  }

  if (largest != i) {
    await swap_value(array, i, largest);
    await swap(array, i, largest);
    await sleep(speed);
    await heapify(array, N, largest, speed);
  }
}

async function flip(array, i, speed) {
  var temp, start = 0;
  while (start < i) {
    await swap_value(array, start, i);
    await swap(array, start, i);
    start++;
    i--;
    await sleep(speed);
  }
}

async function bitonic_merge(array, low, center, direction, speed) {
  if (center > 1) {
    var k = await greatest_power_of_two_less_than(center);

    for (let i = low; i < low + center - k; i++) {
      if ((array[i] > array[i+k] && direction === true) || 
        (array[i] < array[i+k] && direction === false)) {
        await swap_value(array, i, i+k);
        await swap(array, i, i+k);
        await sleep(speed);
      }
    }

    await bitonic_merge(array, low, k, direction, speed);
    await bitonic_merge(array, low + k, center - k, direction, speed);
  }
}

function find_max(array, n) {
  var mi, i;
  for (mi = 0, i = 0; i < n; i++) {
    if (array[i] > array[mi])
      mi = i;
  }

  return mi;
}

function is_sorted(array) {
  for (var i = 1; i < array.length; i++)
    if (array[i] < array[i-1])
      return false;
  return true;
}

function min_run_length(n)
{
    
    var r = 0;
    while (n >= MIN_MERGE)
    {
        r |= (n & 1);
        n >>= 1;
    }
    return n + r + 1;
}

function greatest_power_of_two_less_than(n) {
  var k = 1;
  while (k > 0 && k < n) {
    k = k << 1;
  }
  return k >> 1;
}

async function halver(array, low, high, end, speed) {
  while (low < high) {
    if (high < end && array[low] > array[high]) {
      await swap_value(array, low, high);
      await swap(array, low, high);
      await sleep(speed);
    }
    low++; high--;
  }
}

async function CircleSort_Recursive(array, start, end, speed) {
  var swapped = false;

  if (start === end) {
    return false;
  }

  var i = start;
  var j = end;

  while (i < j) {
    if (array[i] > array[j]) {
      await swap_value(array, i, j);
      await swap(array, i, j);
      swapped = true;
      await sleep(speed);
    }
    await change_value_color(array, i, "red", true);
    await change_value_color(array, j, "blue", true);
    await sleep(speed);
    await change_value_color(array, i, "white", true);
    await change_value_color(array, j, "white", true);
    i++;
    j--;
  }

  if (i === j) {
    if (array[i] > array[j + 1]) {
      await swap_value(array, start, j + 1);
      await swap(array, start, j + 1);
      swapped = true;
      await sleep(speed);
    }
  }

  var mid = Math.floor((end - start) / 2);
  var left = await CircleSort_Recursive(array, start, start + mid, speed);
  var right = await CircleSort_Recursive(array, start + mid + 1, end, speed);
  return swapped || left || right
}

async function circle(array, pos, n, gap, end, speed) {
  if (n < 2) return;

  for (let i = 0; 2*i < (n - 1)*gap; i += gap) {
    if (pos + (n - 1) * gap - i < end && array[pos+i] > array[pos + (n - 1) * gap - i]) {
      await swap_value(array, pos+i, pos + (n - 1) * gap - i);
      await swap(array, pos+i, pos + (n - 1) * gap - i);
      await sleep(speed);
    }
  }

  await circle(array, pos, n/2, gap, end, speed);
  if (pos+n*gap/2 < end) await circle(array, pos+n*gap/2, n/2, gap, end, speed);
}

async function weave_circle(array, pos, n, gap, end, speed) {
  if (n < 2) return;

  await weave_circle(array, pos, n/2, 2*gap, end, speed);
  await weave_circle(array, pos+gap, n/2, 2*gap, end, speed);

  await circle(array, pos, n, gap, end, speed);
}

// sorting algorithms

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
        await swap_value(array, i, i+1);
        await swap(array, i, i+1);
        swapped = true;
        await sleep(speed);
      }
    }
    if (!swapped) break;
    swapped = false;
    for (var i = n - 1; i > 0; i--) {
      if (array[i] > array[i + 1]) {
        await swap_value(array, i, i+1);
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
        await swap_value(array, i, i+1);
        await swap(array, i, i+1);
        sorted = false;
        await sleep(speed);
      }
    }
    for (var i = 0; i < n; i += 2) {
      if (array[i] > array[i+1]) {
        await swap_value(array, i, i+1);
        await swap(array, i, i+1);
        sorted = false;
        await sleep(speed);
      }
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
        pos += 1;
        await change_value_color(array, pos, "blue");
        await sleep(speed);
        await change_value_color(array, pos, "white");
      }
    }

    if (pos == cycle_start) {
      await sleep(speed);
      await change_value_color(array, cycle_start, "white");
      continue;
    }

    while (item == array[pos]) {
      pos += 1;
      await change_value_color(array, pos, "blue");
      await sleep(speed);
      await change_value_color(array, pos, "white");
    }

    if (pos != cycle_start) {
      let temp = item;
      item = array[pos];
      array[pos] = temp;
      await change_value_height(pos, temp);
      await sleep(speed);
    }

    while (pos != cycle_start) {
      pos = cycle_start;
      
      for (let i = cycle_start + 1; i < n; i++) {
        if (array[i] < item) {
          pos += 1;
          await change_value_color(array, pos, "blue");
          await sleep(speed);
          await change_value_color(array, pos, "white");
        }
      }

      while (item == array[pos]) {
        pos += 1;
        await change_value_color(array, pos, "blue");
        await sleep(speed);
        await change_value_color(array, pos, "white");
      }

      if (item != array[pos]) {
        let temp = item;
        item = array[pos];
        array[pos] = temp;
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



async function CircleSort(array, speed) {
  let circle_sort = true;

  while (circle_sort) {
    circle_sort = await CircleSort_Recursive(array, 0, array.length - 1, speed);
  }
}

async function BitonicSortIterative(array, speed, n=array.length) {
  var i, j, k;

  for (k = 2; k < n * 2; k = 2 * k) {
    let m = (((n + (k - 1)) / k) % 2) != 0;

    for (j = k >> 1; j > 0; j = j >> 1) {
      for (i = 0; i < n; i++) {
        let ij = i ^ j;

        if ((ij) > i && ij < n) {
          if ((((i & k) == 0) == m) && array[i] > array[ij]) {
            await swap_value(array, i, ij);
            await swap(array, i, ij);
            await sleep(speed);
          }
          if ((((i & k) != 0) == m) && array[i] < array[ij]) {
            await swap_value(array, i, ij);
            await swap(array, i, ij);
            await sleep(speed);
          }
        }
      }
    }
  }
}

async function DiamondSortIterative(array, speed, length=array.length) {
  var n = 1;
  for (; n < length; n *= 2) {
    var m = 4;
    for (; m<= length; m *= 2) {
      for (let k = 0; k < m/2; k++) {
        let center = k <= m/4 ? k : m/2-k;
        for (let j = 0; j < length; j += m) {
          if (j+center+1 < length) {
            for (let i = j+center; i+1 < Math.min(length, j+m-center); i += 2) {
              if (array[i] > array[i+1]) {
                await swap_value(array, i, i+1);
                await swap(array, i, i+1);
                await sleep(speed);
              }
            }
          }
        }
      }
    }
    m /= 2;
    for (let k = 0; k <= m/2; k++) {
      for (let i = k; i+1 < Math.min(length, m-k); i += 2) {
        if (array[i] > array[i+1]) {
          await swap_value(array, i, i+1);
          await swap(array, i, i+1);
          await sleep(speed);
        }
      }
    }
  }
}

async function CreaseSort(array, speed, n=array.length) {
  var max = 1;
  for (; max*2 < n; max *= 2);

  var next = max;
  while (next > 0) {
    for (let i = 0; i + 1 < n; i += 2) {
      if (array[i] > array[i+1]) {
        await swap_value(array, i, i+1);
        await swap(array, i, i+1);
        await sleep(speed);
      }
    }
    for (let j = max; j >= next && j > 1; j /= 2) {
      for (let i = 1; i+j-1 < n; i += 2) {
        if (array[i] > array[i+j-1]) {
          await swap_value(array, i, i+j-1);
          await swap(array, i, i+j-1);
          await sleep(speed);
        }
      }
    }
    next /= 2;
  }
}

async function FoldSort(array, speed, n=array.length) {
  var ceil_log = 1;
  for (; (1 << ceil_log) < n; ceil_log++);

  var end = n;
  n = 1 << ceil_log;

  for (let k = n >> 1; k > 0; k >>=1) {
    for (let i = n; i >= k; i >>= 1) {
      for (let j = 0; j < end; j += i) {
        await halver(array, j, j + i - 1, end, speed);
      }
    }
  }
}

async function WeaveSortRecursive(array, speed, n=array.length) {
  let end = n;
  let k = 1;
  for (; k < n; k *= 2) {
    await weave_circle(array, 0, n, 1, end, speed);
  }
}

async function WeaveSortIterative(array, speed, n=array.length) {
  let end = n;
  let k = 1;
  
  for (; k < n; k *= 2);
  
  for (let i = 1; i < k; i *= 2) {
    for (let j = 1; j <= i; j *= 2) {
      for (let l = 0; l < k; l += k/j) {
        for (let d = k/i/2, m = 0, a = k/j-d; a >= k/j/2; a -= d) {
          for (let p = 0; p < d; p++, m++) {
            if (l+a+p < end && array[l+m] > array[l+a+p]) {
              await swap_value(array, l+m, l+a+p);
              await swap(array, l+m, l+a+p);
              await sleep(speed);
            }
          }
        }
      }
    }
  }
}

async function StalinSort(array, speed, n=array.length) {
  let i = 0;
  let max = array[0];
  while (i < n-1) {
    await change_value_color(array, i, "red");
    if (max > array[i]) {
      array.splice(i, 1);
      await render_values(array);
      await sleep(speed);
    } else {
      max = array[i];
      i++;
    }
    await change_value_color(array, i, "white");
  }
}
