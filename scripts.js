document.getElementById('startRace').addEventListener('click', startRace);

const algorithms = {
    bubbleSort: bubbleSort,
    selectionSort: selectionSort,
    quickSort: quickSort,
    mergeSort: mergeSort
};

let leaderboardData = [];  // Store leaderboard data

function startRace() {
    const arraySize = document.getElementById('arraySize').value;
    const selectedAlgorithms = Array.from(document.getElementById('algorithmSelect').selectedOptions).map(opt => opt.value);
    
    if (selectedAlgorithms.length === 0) {
        alert('Select at least one algorithm!');
        return;
    }

    const array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100));
    document.getElementById('raceArea').innerHTML = '';

    selectedAlgorithms.forEach(algo => {
        const container = document.createElement('div');
        container.id = algo;
        container.className = 'sorting-container';
        document.getElementById('raceArea').appendChild(container);

        displayArray(container, array);
        const clonedArray = [...array];
        setTimeout(() => runAlgorithm(algo, clonedArray, container), 1000);
    });
}

function displayArray(container, array) {
    container.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value * 3}px`;
        container.appendChild(bar);
    });
}

function runAlgorithm(name, array, container) {
    const startTime = performance.now();
    algorithms[name](array, updatedArray => {
        displayArray(container, updatedArray);
    });
    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(2);
    updateLeaderboard(name, timeTaken);
}

// Sorting Algorithms
function bubbleSort(array, updateDisplay) {
    let len = array.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];  // Swap
                updateDisplay([...array]);
            }
        }
    }
}

function selectionSort(array, updateDisplay) {
    let len = array.length;
    for (let i = 0; i < len; i++) {
        let minIdx = i;
        for (let j = i + 1; j < len; j++) {
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        [array[i], array[minIdx]] = [array[minIdx], array[i]];  // Swap
        updateDisplay([...array]);
    }
}

function quickSort(array, updateDisplay, start = 0, end = array.length - 1) {
    if (start >= end) return;
    let pivotIdx = partition(array, updateDisplay, start, end);
    quickSort(array, updateDisplay, start, pivotIdx - 1);
    quickSort(array, updateDisplay, pivotIdx + 1, end);
}

function partition(array, updateDisplay, start, end) {
    let pivot = array[end];
    let i = start;
    for (let j = start; j < end; j++) {
        if (array[j] < pivot) {
            [array[i], array[j]] = [array[j], array[i]]; // Swap
            i++;
        }
        updateDisplay([...array]);
    }
    [array[i], array[end]] = [array[end], array[i]];  // Swap pivot
    updateDisplay([...array]);
    return i;
}

function mergeSort(array, updateDisplay) {
    if (array.length < 2) return array;
    const mid = Math.floor(array.length / 2);
    const left = mergeSort(array.slice(0, mid), updateDisplay);
    const right = mergeSort(array.slice(mid), updateDisplay);
    const sorted = merge(left, right);
    updateDisplay([...sorted]);
    return sorted;
}

function merge(left, right) {
    const result = [];
    while (left.length && right.length) {
        result.push(left[0] < right[0] ? left.shift() : right.shift());
    }
    return [...result, ...left, ...right];
}

function updateLeaderboard(name, time) {
    // Add the algorithm result to the leaderboard data
    leaderboardData.push({ name, time });

    // Sort leaderboard by time in ascending order (faster algorithms come first)
    leaderboardData.sort((a, b) => a.time - b.time);

    // Clear and update leaderboard with all results, sorted by time
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = "<h3>Leaderboard</h3><ul>";

    // Display sorted leaderboard with all results
    leaderboardData.forEach(result => {
        leaderboard.innerHTML += `<li>${result.name}: ${result.time} ms</li>`;
    });

    leaderboard.innerHTML += "</ul>";
}
