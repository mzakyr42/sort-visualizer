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

async function sift_down(array, root, dist, start, speed, isMax) {
  var compare = true;

  if (isMax) compare = false;
  else compare = true;

  while (root <= dist / 2) {
    var leaf = 2 * root;

    if (leaf < dist && array[start + leaf - 1] > array[start + leaf] == compare) {
      leaf++;
    }

    await change_value_color(array, start + root - 1, "blue");
    await change_value_color(array, start + leaf - 1, "red");
    await sleep(speed);
    await change_value_color(array, start + root - 1, "white");
    await change_value_color(array, start + leaf - 1, "white");

    if (array[start + root - 1] > array[start + leaf - 1] == compare) {
      await swap_value(array, start + root - 1, start + leaf - 1);
      await swap(array, start + root - 1, start + leaf - 1);
      root = leaf;
      await sleep(speed);
    } else break;
  }
}

async function heapify(array, low, high, speed, isMax) {
  var length = high - low;

  for (let i = length / 2; i >= 1; i--) {
    await sift_down(array, i, length, low, speed, isMax);
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

async function odd_even_merge(array, low, mid, n, r) {
  var m = r * 2;
  if (m < n) {
    if ((n/r)%2 != 0) {
      await odd_even_merge(array, low, parseInt((mid+1)/2), n + r, m);
      await odd_even_merge(array, low+r, parseInt(mid/2), n - r, m);
    } else {
      await odd_even_merge(array, low, parseInt((mid+1)/2), n, m);
      await odd_even_merge(array, low+r, parseInt(mid/2), n, m);
    }

    if (mid % 2 != 0) {
      for (let i = low; i + r < low + n; i += m) {
        if (array[i] > array[i+r]) {
          await swap_value(array, i, i+r);
          await swap(array, i, i+r);
          await sleep(speed);
        }
      }
    } else {
      for (let i = low + r; i + r < low + n; i += m) {
        if (array[i] > array[i+r]) {
          await swap_value(array, i, i+r);
          await swap(array, i, i+r);
          await sleep(speed);
        }
      }
    }
  } else {
    if (n > r) {
      if (array[low] > array[low+r]) {
        await swap_value(array, low, low+r);
        await swap(array, low, low+r);
        await sleep(speed);
      }
    }
  }
}

async function reverse_array(array, speed) {
  let mid = Math.floor(array.length / 2);
  for (let i = 0, j = array.length - 1; i < mid; i++, j--) {
    await swap_value(array, i, j);
    await swap(array, i, j);
    await sleep(speed);
  }
}

async function merge_in_place(array, low, mid, high, speed) {
  let i = low;
  while (i <= mid) {
    if (array[i] > array[mid+1]) {
      await swap_value(array, i, mid+1);
      await swap(array, i, mid+1);
      await sleep(speed);
      for (let j = mid + 1; j < high; j++) {
        if (array[j] > array[j+1]) {
          await swap_value(array, j, j+1);
          await swap(array, j, j+1);
          await sleep(speed);
        }
      }
    }
    i++;
  }
}
