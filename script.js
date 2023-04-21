const canvas = document.getElementById("sortingCanvas");
const ctx = canvas.getContext("2d");
const windowSizeInput = document.getElementById("windowSize");
const findMaxSumBtn = document.getElementById("findMaxSum");

canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

const arrSize = 20;
const arr = [];
const barWidth = Math.floor(canvas.width / (arrSize+1));
const padding = 2;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createArray() {
  for (let i = 0; i < arrSize; i++) {
    // Generate random values between 25 and 500
    arr[i] = Math.floor(Math.random() * (500 - 25 + 1)) + 25;
  }
}

// Function to draw the array on canvas with optional highlighted elements
function drawArray(highlight = [], highlightMax = false) {
  // Clear the canvas to start fresh
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Add shadow effect to bars
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 4;

  // Loop through the array elements and draw the bars
  for (let i = 0; i < arrSize; i++) {
    // Create gradient colors for bars depending on whether they should be highlighted
    const gradient = ctx.createLinearGradient(
      i * (barWidth + padding) + 20,
      canvas.height - 40,
      i * (barWidth + padding) + 20,
      canvas.height - arr[i] - 40
    );
    gradient.addColorStop(
      0,
      highlight.includes(i) ? (highlightMax ? "#4CAF50" : "#FF9800") : "#2196F3"
    );
    gradient.addColorStop(
      1,
      highlight.includes(i) ? (highlightMax ? "#388E3C" : "#EF6C00") : "#1976D2"
    );

    // Fill the bars with the created gradient colors
    ctx.fillStyle = gradient;
    ctx.fillRect(
      i * (barWidth + padding) + 20,
      canvas.height - arr[i] - 40,
      barWidth,
      arr[i]
    );

    // Add value text on top of each bar
    ctx.font = "bold 14px Arial";

    if (arr[i] < 20) {
      // If the value is less than 20, display the text below the bar
      ctx.fillStyle = "#333";
      ctx.fillText(
        arr[i],
        i * (barWidth + padding) +
          barWidth / 2 -
          ctx.measureText(arr[i]).width / 2 +
          20,
        canvas.height - arr[i] - 40 + 32
      );
    } else {
      // If the value is greater than or equal to 20, display the text inside the bar at the top
      ctx.fillStyle = "#fff";
      ctx.fillText(
        arr[i],
        i * (barWidth + padding) +
          barWidth / 2 -
          ctx.measureText(arr[i]).width / 2 +
          20,
        canvas.height - arr[i] - 40 + 18
      );
    }
  }

  // Reset shadow properties to prevent affecting other elements on the canvas
  ctx.shadowColor = "transparent";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
}

// Function to draw an overlay text for displaying step information and time/space complexity
function drawOverlayText(text, complexityText) {
  // Set font size for the main text
  ctx.font = "20px Arial";

  // Calculate the width of the text and the background rectangle
  const textWidth = Math.max(
    ctx.measureText(text).width,
    ctx.measureText(complexityText).width
  );
  const backgroundWidth = textWidth + 40;

  // Draw a semi-transparent rounded rectangle as the background for the text
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  const borderRadius = 10;
  ctx.beginPath();
  ctx.moveTo(20 + borderRadius, 20);
  ctx.lineTo(20 + backgroundWidth - borderRadius, 20);
  ctx.quadraticCurveTo(
    20 + backgroundWidth,
    20,
    20 + backgroundWidth,
    20 + borderRadius
  );
  ctx.lineTo(20 + backgroundWidth, 80 - borderRadius);
  ctx.quadraticCurveTo(
    20 + backgroundWidth,
    80,
    20 + backgroundWidth - borderRadius,
    80
  );
  ctx.lineTo(20 + borderRadius, 80);
  ctx.quadraticCurveTo(20, 80, 20, 80 - borderRadius);
  ctx.lineTo(20, 20 + borderRadius);
  ctx.quadraticCurveTo(20, 20, 20 + borderRadius, 20);
  ctx.closePath();
  ctx.fill();

  // Draw the step information text
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, 30, 50);

  // Draw the time and space complexity text
  ctx.font = "14px Arial";
  ctx.fillText(complexityText, 30, 70);
}

async function bubbleSort(delay) {
  const complexityText = "Time Complexity: O(n^2) | Space Complexity: O(1)";
  for (let i = 0; i < arrSize; i++) {
    for (let j = 0; j < arrSize - i - 1; j++) {
      drawOverlayText(`Comparing ${arr[j]} and ${arr[j + 1]}`, complexityText);
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
      await new Promise((resolve) =>
        setTimeout(() => {
          drawArray([j, j + 1]);
          resolve();
        }, delay)
      );
    }
  }
  ctx.clearRect(0, 0, canvas.width, 80);
}

async function selectionSort(delay) {
  const complexityText = "Time Complexity: O(n^2) | Space Complexity: O(1)";
  for (let i = 0; i < arrSize - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arrSize; j++) {
      drawOverlayText(
        `Comparing ${arr[j]} and ${arr[minIndex]}`,
        complexityText
      );
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
      await new Promise((resolve) =>
        setTimeout(() => {
          drawArray([minIndex, j]);
          resolve();
        }, delay)
      );
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  ctx.clearRect(0, 0, canvas.width, 80);
}

async function insertionSort(delay) {
  const complexityText = "Time Complexity: O(n^2) | Space Complexity: O(1)";
  for (let i = 1; i < arrSize; i++) {
    let key = arr[i];
    let j = i - 1;

    drawOverlayText(`Inserting ${key}`, complexityText);

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
      await new Promise((resolve) =>
        setTimeout(() => {
          drawArray([j + 1, j + 2]);
          resolve();
        }, delay)
      );
    }
    arr[j + 1] = key;
  }
  ctx.clearRect(0, 0, canvas.width, 80);
}

async function merge(arr, l, m, r, delay, complexityText) {
  const n1 = m - l + 1;
  const n2 = r - m;

  let L = [];
  let R = [];

  for (let i = 0; i < n1; i++) {
    L[i] = arr[l + i];
  }

  for (let j = 0; j < n2; j++) {
    R[j] = arr[m + 1 + j];
  }

  let i = 0;
  let j = 0;
  let k = l;

  drawOverlayText(`Merging subarrays from ${l} to ${r}`, complexityText);
  await new Promise((resolve) => setTimeout(resolve, delay));

  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
    await new Promise((resolve) =>
      setTimeout(() => {
        drawArray([k - 1]);
        resolve();
      }, delay)
    );
  }

  while (i < n1) {
    arr[k] = L[i];
    i++;
    k++;
    await new Promise((resolve) =>
      setTimeout(() => {
        drawArray([k - 1]);
        resolve();
      }, delay)
    );
  }

  while (j < n2) {
    arr[k] = R[j];
    j++;
    k++;
    await new Promise((resolve) =>
      setTimeout(() => {
        drawArray([k - 1]);
        resolve();
      }, delay)
    );
  }
}

async function mergeSort(arr, l, r, delay) {
  const complexityText = "Time Complexity: O(n log n) | Space Complexity: O(n)";
  if (l < r) {
    let m = parseInt((l + r) / 2);
    await mergeSort(arr, l, m, delay);
    await mergeSort(arr, m + 1, r, delay);
    await merge(arr, l, m, r, delay, complexityText);
  }
  ctx.clearRect(0, 0, canvas.width, 80);
}

// Quick Sort
async function quickSort(arr, low, high, delay) {
  const complexityText =
    "Time Complexity: O(n log n) | Space Complexity: O(log n)";
  if (low < high) {
    const pi = await partition(arr, low, high, delay, complexityText);
    await quickSort(arr, low, pi - 1, delay);
    await quickSort(arr, pi + 1, high, delay);
  }
  ctx.clearRect(0, 0, canvas.width, 80);
}

async function partition(arr, low, high, delay, complexityText) {
  let pivot = arr[high];
  let i = low - 1;

  for (let j = low; j <= high - 1; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];

      drawOverlayText(`Swapping elements at indices ${i} and ${j}`, complexityText);
      drawArray([i, j]);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

  drawOverlayText(`Swapping elements at indices ${i + 1} and ${high}`, complexityText);
  drawArray([i + 1, high]);
  await new Promise((resolve) => setTimeout(resolve, delay));

  return i + 1;
}

// Heap Sort
function heapify(arr, n, i, delay, complexityText) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    drawOverlayText(
      `Swapping elements at indices ${i} and ${largest}`,
      complexityText
    );
    heapify(arr, n, largest, delay, complexityText);
  }
}

async function heapSort(delay) {
  const complexityText = "Time Complexity: O(n log n) | Space Complexity: O(1)";

  let n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await new Promise((resolve) =>
      setTimeout(() => {
        heapify(arr, n, i, delay, complexityText);
        drawArray([i]);
        resolve();
      }, delay)
    );
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];

    drawOverlayText(`Swapping root with element at index ${i}`, complexityText);
    await new Promise((resolve) => setTimeout(resolve, delay));

    await new Promise((resolve) =>
      setTimeout(() => {
        heapify(arr, i, 0, delay, complexityText);
        drawArray([i]);
        resolve();
      }, delay)
    );
  }
  ctx.clearRect(0, 0, canvas.width, 80);
}

// Radix Sort
function getMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

async function countingSortForRadix(arr, exp, delay) {
  let n = arr.length;
  let output = new Array(n).fill(0);
  let count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    let index = parseInt(arr[i] / exp) % 10;
    count[index]++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    let index = parseInt(arr[i] / exp) % 10;
    output[count[index] - 1] = arr[i];
    count[index]--;
  }

  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    await new Promise((resolve) =>
      setTimeout(() => {
        drawArray([i]);
        resolve();
      }, delay)
    );
  }
}

async function countingSort(delay) {
  const complexityText =
    "Time Complexity: O(n + k) | Space Complexity: O(n + k)";
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(arr.length).fill(0);

  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;

    drawOverlayText(`Counting occurrences of ${arr[i]}`, complexityText);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;

    drawArray([i]);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
  }
  ctx.clearRect(0, 0, canvas.width, 80);
}


async function countingSortByDigit(arr, exp, delay, complexityText) {
  const output = new Array(arr.length).fill(0);
  const count = new Array(10).fill(0);

  for (let i = 0; i < arr.length; i++) {
    count[Math.floor(arr[i] / exp) % 10]++;
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
    count[Math.floor(arr[i] / exp) % 10]--;

    drawArray([i]);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
  }

  drawOverlayText(`Sorting by ${exp} place`, complexityText);
  await new Promise((resolve) => setTimeout(resolve, delay));
  ctx.clearRect(0, 0, canvas.width, 80);
}
async function countingSortRadix(arr, exp, delay, complexityText) {
  const n = arr.length;
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    count[Math.floor(arr[i] / exp) % 10]++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
    count[Math.floor(arr[i] / exp) % 10]--;
  }

  for (let i = 0; i < n; i++) {
    drawOverlayText(`Updating array with sorted elements based on current digit`, complexityText);
    await new Promise((resolve) => setTimeout(resolve, delay));
    arr[i] = output[i];
    drawArray([i]);
  }
}

async function radixSort(delay) {
  const complexityText = "Time Complexity: O(nk) | Space Complexity: O(n + k)";
  const max = Math.max(...arr);
  let exp = 1;

  while (Math.floor(max / exp) > 0) {
    drawOverlayText(`Sorting array based on digit at place ${exp}`, complexityText);
    await new Promise((resolve) => setTimeout(resolve, delay));

    await countingSortRadix(arr, exp, delay, complexityText);
    exp *= 10;
  }

  ctx.clearRect(0, 0, canvas.width, 80);
}



// Bucket Sort
async function insertionSortBucket(bucket, delay, complexityText) {
  for (let i = 1; i < bucket.length; i++) {
    let key = bucket[i];
    let j = i - 1;
    while (j >= 0 && bucket[j] > key) {
      drawOverlayText(
        `Comparing and moving elements in bucket`,
        complexityText
      );
      await new Promise((resolve) => setTimeout(resolve, delay));

      bucket[j + 1] = bucket[j];
      j--;
    }
    bucket[j + 1] = key;
  }
}

async function bucketSort(delay) {
  const complexityText =
    "Time Complexity: O(n + n^2/k + k) | Space Complexity: O(nk)";
  const numBuckets = 5;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const bucketSize = Math.ceil(range / numBuckets);
  const buckets = new Array(numBuckets).fill(null).map(() => []);

  for (let i = 0; i < arr.length; i++) {
    const bucketIndex = Math.floor((arr[i] - min) / bucketSize);
    buckets[bucketIndex].push(arr[i]);

    drawOverlayText(
      `Placing ${arr[i]} in bucket ${bucketIndex}`,
      complexityText
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  let index = 0;
  for (let i = 0; i < buckets.length; i++) {
    await insertionSortBucket(buckets[i], delay, complexityText);

    for (let j = 0; j < buckets[i].length; j++) {
      arr[index++] = buckets[i][j];
      drawArray([index - 1]);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  ctx.clearRect(0, 0, canvas.width, 80);
}

createArray();
drawArray();

const shuffleBtn = document.getElementById("shuffle");
const sortBtn = document.getElementById("sort");
const algorithmSelect = document.getElementById("algorithm");
const speedInput = document.getElementById("speed");

shuffleBtn.addEventListener("click", () => {
  createArray();
  drawArray();
});

sortBtn.addEventListener("click", async () => {
  const algorithm = algorithmSelect.value;
  const delay = 1001 - speedInput.value;

  if (algorithm === "bubble") {
    await bubbleSort(delay);
  } else if (algorithm === "selection") {
    await selectionSort(delay);
  } else if (algorithm === "insertion") {
    await insertionSort(delay);
  } else if (algorithm === "merge") {
    await mergeSort(arr, 0, arrSize - 1, delay);
  } else if (algorithm === "quick") {
    await quickSort(arr, 0, arrSize - 1, delay);
  } else if (algorithm === "heap") {
    await heapSort(arr, delay);
  } else if (algorithm === "counting") {
    await countingSort(arr, delay);
  } else if (algorithm === "radix") {
    await radixSort(arr, delay);
  } else if (algorithm === "bucket") {
    await bucketSort(arr, delay);
  }
});
